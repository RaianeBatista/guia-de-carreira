import { NextRequest, NextResponse } from "next/server";

// Configurações da API StackSpot (servidor)
const STACKSPOT_CONFIG = {
  IDM_URL:
    process.env.NEXT_PUBLIC_STACKSPOT_IDM_URL || "https://idm.stackspot.com",
  INFERENCE_URL:
    process.env.NEXT_PUBLIC_STACKSPOT_INFERENCE_URL ||
    "https://genai-inference-app.stackspot.com",
  REALM: process.env.NEXT_PUBLIC_STACKSPOT_REALM || "",
  CLIENT_ID: process.env.STACKSPOT_CLIENT_ID || "",
  CLIENT_SECRET: process.env.STACKSPOT_CLIENT_SECRET || "",
  AGENT_ID:
    process.env.NEXT_PUBLIC_STACKSPOT_AGENT_ID || "01K5RTDWRXJFW8R9EGCRGGQ3XX",
};

interface StackSpotAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface StackSpotChatRequest {
  streaming: boolean;
  user_prompt: string;
  stackspot_knowledge: boolean;
  return_ks_in_response: boolean;
  session_id?: string;
}

interface StackSpotChatResponse {
  // Formato OpenAI (se usado)
  id?: string;
  object?: string;
  created?: number;
  model?: string;
  choices?: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];

  // Formato StackSpot específico
  message?: string;
  stop_reason?: string;
  tokens?: {
    user: number;
    enrichment: number;
    output: number;
  };
  knowledge_source_id?: string[];
  source?: string[];
  cross_account_source?: string[];
}

// Cache do token e sessões (simples - em produção use Redis ou similar)
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

// Cache de sessões e histórico de conversas por IP/usuário
// Aumentando TTL e melhorando gestão de memória
const sessionCache = new Map<
  string,
  { sessionId: string; lastAccess: number }
>();
const conversationHistory = new Map<string, ChatMessage[]>();

// Limpa sessões antigas (TTL de 2 horas)
const SESSION_TTL = 2 * 60 * 60 * 1000; // 2 horas

function cleanOldSessions() {
  const now = Date.now();
  for (const [ip, data] of sessionCache.entries()) {
    if (now - data.lastAccess > SESSION_TTL) {
      sessionCache.delete(ip);
      conversationHistory.delete(data.sessionId);
      console.log(`🧹 [SERVER] Sessão expirada removida: ${data.sessionId}`);
    }
  }
}

async function authenticate(): Promise<string> {
  // Verifica se o token ainda é válido
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  console.log("🔑 [SERVER] Autenticando com StackSpot...");
  console.log(
    "🔧 [SERVER] CLIENT_ID configurado:",
    !!STACKSPOT_CONFIG.CLIENT_ID
  );
  console.log(
    "🔧 [SERVER] CLIENT_SECRET configurado:",
    !!STACKSPOT_CONFIG.CLIENT_SECRET
  );
  console.log("🔧 [SERVER] REALM:", STACKSPOT_CONFIG.REALM);

  const authUrl = `${STACKSPOT_CONFIG.IDM_URL}/${STACKSPOT_CONFIG.REALM}/oidc/oauth/token`;

  const formData = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: STACKSPOT_CONFIG.CLIENT_ID,
    client_secret: STACKSPOT_CONFIG.CLIENT_SECRET,
  });

  const response = await fetch(authUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      "❌ [SERVER] Erro na autenticação:",
      response.status,
      errorText
    );
    throw new Error(
      `Erro na autenticação: ${response.status} ${response.statusText}`
    );
  }

  const authData: StackSpotAuthResponse = await response.json();
  console.log("✅ [SERVER] Autenticação bem-sucedida!");

  cachedToken = authData.access_token;
  tokenExpiry = Date.now() + authData.expires_in * 1000 - 60000; // 1 min de margem

  return cachedToken;
}

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 [SERVER] Nova requisição de chat recebida");

    // Extrai a mensagem do body
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Mensagem é obrigatória" },
        { status: 400 }
      );
    }

    console.log("📝 [SERVER] Mensagem do usuário:", message);

    // Limpa sessões antigas periodicamente
    cleanOldSessions();

    // Gera ou recupera session_id baseado no Session ID do cliente (nova sessão a cada F5)
    const clientSessionId = request.headers.get("X-Session-ID");
    const clientIP =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "anonymous_" + Math.random().toString(36).substring(7);

    const sessionKey = clientSessionId || clientIP;
    console.log(
      "🔍 [SERVER] Sessão identificada:",
      sessionKey,
      clientSessionId ? "(Session ID)" : "(IP Fallback)"
    );

    let sessionData = sessionCache.get(sessionKey);
    let sessionId: string;

    if (!sessionData) {
      sessionId = `session_${Date.now()}_${Math.random()
        .toString(36)
        .substring(7)}`;
      sessionData = { sessionId, lastAccess: Date.now() };
      sessionCache.set(sessionKey, sessionData);
      conversationHistory.set(sessionId, []);
      console.log(
        "🆕 [SERVER] Nova sessão criada:",
        sessionId,
        "para cliente:",
        sessionKey
      );
    } else {
      sessionId = sessionData.sessionId;
      sessionData.lastAccess = Date.now();
      sessionCache.set(sessionKey, sessionData);
      console.log(
        "🔄 [SERVER] Usando sessão existente:",
        sessionId,
        "para cliente:",
        sessionKey
      );
    }

    // Recupera e atualiza histórico da conversa
    const history = conversationHistory.get(sessionId) || [];
    console.log(
      `📚 [SERVER] Histórico atual da sessão ${sessionId}:`,
      history.length,
      "mensagens"
    );

    // Log do histórico existente para debug
    if (history.length > 0) {
      console.log("📖 [SERVER] Últimas mensagens do histórico:");
      history.slice(-3).forEach((msg: ChatMessage, idx: number) => {
        console.log(
          `   ${idx + 1}. [${msg.role}]: ${msg.content.substring(0, 50)}...`
        );
      });
    }

    // Adiciona mensagem do usuário ao histórico
    const userMessage: ChatMessage = {
      role: "user",
      content: message,
      timestamp: Date.now(),
    };
    history.push(userMessage);
    conversationHistory.set(sessionId, history);
    console.log(
      `✅ [SERVER] Mensagem do usuário adicionada. Total: ${history.length} mensagens`
    );

    // Extrai informações importantes do histórico completo
    const extractPersonalInfo = (messages: ChatMessage[]) => {
      const personalInfo: string[] = [];
      const keywords = [
        "faculdade",
        "universidade",
        "curso",
        "formação",
        "graduação",
        "trabalho",
        "emprego",
        "empresa",
        "profissão",
        "cargo",
        "idade",
        "ano",
        "semestre",
        "período",
        "estudando",
        "fazendo",
      ];

      messages.forEach((msg) => {
        if (msg.role === "user") {
          keywords.forEach((keyword) => {
            if (msg.content.toLowerCase().includes(keyword)) {
              personalInfo.push(`• ${msg.content}`);
            }
          });
        }
      });

      return [...new Set(personalInfo)]; // Remove duplicatas
    };

    const personalContext = extractPersonalInfo(history);

    // Monta contexto da conversa (últimas 10 mensagens para melhor contexto)
    const recentHistory = history.slice(-10);
    const conversationContext = recentHistory
      .map(
        (msg: ChatMessage) =>
          `${msg.role === "user" ? "Usuário" : "Assistente"}: ${msg.content}`
      )
      .join("\n\n");

    console.log(
      "📚 [SERVER] Contexto montado com",
      recentHistory.length,
      "mensagens:"
    );
    console.log(
      "👤 [SERVER] Informações pessoais identificadas:",
      personalContext.length
    );
    console.log(
      "📝 [SERVER] Contexto completo:",
      conversationContext.substring(0, 200) + "..."
    );

    // Verifica se as credenciais estão configuradas
    if (
      !STACKSPOT_CONFIG.CLIENT_ID ||
      !STACKSPOT_CONFIG.CLIENT_SECRET ||
      !STACKSPOT_CONFIG.REALM
    ) {
      console.warn("⚠️ [SERVER] Credenciais não configuradas");
      return NextResponse.json({
        response: `[MODO FALLBACK] Sobre "${message}": Como especialista em orientação de carreira, posso te ajudar com desenvolvimento profissional, planejamento de carreira, transições e habilidades técnicas. Esta é uma resposta simulada - configure suas credenciais StackSpot para respostas personalizadas.`,
        source: "fallback",
      });
    }

    // Autentica
    const token = await authenticate();

    // Prepara prompt com contexto estruturado da conversa
    let contextualPrompt = message;

    if (recentHistory.length > 1) {
      let prompt = `INSTRUÇÕES: Você é o Guia de Carreiras da StackSpot. Mantenha sempre o contexto da conversa e lembre-se das informações que o usuário compartilhou.\n\n`;

      if (personalContext.length > 0) {
        prompt += `INFORMAÇÕES IMPORTANTES DO USUÁRIO:\n${personalContext.join(
          "\n"
        )}\n\n`;
      }

      prompt += `HISTÓRICO DA CONVERSA:\n${conversationContext}\n\n`;
      prompt += `NOVA PERGUNTA: ${message}\n\n`;
      prompt += `IMPORTANTE: Baseie sua resposta no contexto acima. Se o usuário fizer uma pergunta sobre algo que ele já mencionou (como "qual faculdade estou fazendo?"), use as informações do histórico da conversa para responder adequadamente.`;

      contextualPrompt = prompt;
    }

    console.log("🧠 [SERVER] Prompt contextual:", contextualPrompt);

    // Prepara a requisição para o agente (com contexto para manter conversa)
    const requestBody: StackSpotChatRequest = {
      streaming: false,
      user_prompt: contextualPrompt,
      stackspot_knowledge: true,
      return_ks_in_response: true,
      session_id: sessionId,
    };

    const chatUrl = `${STACKSPOT_CONFIG.INFERENCE_URL}/v1/agent/${STACKSPOT_CONFIG.AGENT_ID}/chat`;

    console.log("🚀 [SERVER] Enviando para agente:", STACKSPOT_CONFIG.AGENT_ID);
    console.log("📤 [SERVER] URL:", chatUrl);
    console.log("🔗 [SERVER] Session ID:", sessionId);
    console.log("📦 [SERVER] Payload:", JSON.stringify(requestBody, null, 2));

    const chatResponse = await fetch(chatUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!chatResponse.ok) {
      const errorText = await chatResponse.text();
      console.error(
        "❌ [SERVER] Erro na API StackSpot:",
        chatResponse.status,
        errorText
      );

      return NextResponse.json(
        {
          error: `Erro na API StackSpot: ${chatResponse.status} - ${errorText}`,
          source: "stackspot-error",
        },
        { status: chatResponse.status }
      );
    }

    const chatData: StackSpotChatResponse = await chatResponse.json();
    console.log("✅ [SERVER] Resposta recebida do StackSpot");
    console.log("📥 [SERVER] Dados:", JSON.stringify(chatData, null, 2));

    // Extrai a resposta - a API StackSpot pode retornar formatos diferentes
    let agentResponse: string;

    if (chatData.choices && chatData.choices.length > 0) {
      // Formato padrão OpenAI
      agentResponse = chatData.choices[0].message.content;
    } else if (chatData.message) {
      // Formato StackSpot direto
      agentResponse = chatData.message;
    } else {
      console.error("❌ [SERVER] Formato de resposta inesperado:", chatData);
      return NextResponse.json(
        { error: "Formato de resposta inválido da API StackSpot" },
        { status: 500 }
      );
    }

    // Função para formatar a resposta com melhor estrutura
    function formatResponse(text: string): string {
      let formatted = text;
      
      // Remove múltiplos espaços e quebras de linha desnecessárias
      formatted = formatted.replace(/\s+/g, ' ').trim();
      
      // Adiciona quebras de linha antes de títulos/seções principais
      formatted = formatted.replace(/([.!?:]) ([A-Z][^:]*:)/g, '$1\n\n**$2**');
      
      // Adiciona quebras de linha antes de listas com hífen
      formatted = formatted.replace(/([.!?]) (- [^-])/g, '$1\n\n$2');
      
      // Formata listas com hífen
      formatted = formatted.replace(/ - /g, '\n• ');
      
      // Adiciona quebras de linha antes de links de referência
      formatted = formatted.replace(/([.!?]) (\[🔗)/g, '$1\n\n$2');
      
      // Separa parágrafos principais
      formatted = formatted.replace(/([.!?]) ([A-Z][a-z]+ (e |de |da |do |na |no |em |com |para |sobre |que |esse|essas|esses))/g, '$1\n\n$2');
      
      // Adiciona espaçamento antes de perguntas finais
      formatted = formatted.replace(/([.!?]) (Quer que|Qual|Como|Posso|Gostaria)/g, '$1\n\n$2');
      
      // Adiciona espaçamento antes de resumos
      formatted = formatted.replace(/([.!?]) (Resumo|Em resumo|Para resumir)/g, '$1\n\n**$2**');
      
      // Formata valores monetários e números
      formatted = formatted.replace(/R\$ /g, '\n💰 **R$ ');
      formatted = formatted.replace(/(\d+%)/g, '**$1**');
      
      // Adiciona ícones em seções específicas
      formatted = formatted.replace(/\*\*Cursos e caminhos/g, '🎓 **Cursos e caminhos');
      formatted = formatted.replace(/\*\*Mercado e tendências/g, '📈 **Mercado e tendências');
      formatted = formatted.replace(/\*\*Média salarial/g, '💰 **Média salarial');
      
      return formatted;
    }

    // Aplica a formatação na resposta
    agentResponse = formatResponse(agentResponse);

    console.log(
      "🎯 [SERVER] Resposta do seu agente personalizado (formatada):",
      agentResponse
    );

    // Adiciona resposta do agente ao histórico
    const assistantMessage: ChatMessage = {
      role: "assistant",
      content: agentResponse,
      timestamp: Date.now(),
    };
    history.push(assistantMessage);
    conversationHistory.set(sessionId, history);

    console.log(
      "💾 [SERVER] Histórico atualizado com",
      history.length,
      "mensagens"
    );

    return NextResponse.json({
      response: agentResponse,
      source: "stackspot-agent",
      agent_id: STACKSPOT_CONFIG.AGENT_ID,
      tokens_used: chatData.tokens || null,
      session_id: sessionId,
      conversation_length: history.length, // Para debug
    });
  } catch (error) {
    console.error("❌ [SERVER] Erro geral:", error);

    return NextResponse.json(
      {
        response: `Desculpe, ocorreu um erro ao processar sua mensagem. Erro: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`,
        source: "error-fallback",
      },
      { status: 500 }
    );
  }
}
