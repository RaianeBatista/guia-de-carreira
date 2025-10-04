// Serviço simplificado para comunicação com API StackSpot
// A autenticação agora acontece no servidor via API route

export class StackSpotService {
  private static instance: StackSpotService;
  private sessionId: string | null = null;

  static getInstance(): StackSpotService {
    if (!StackSpotService.instance) {
      StackSpotService.instance = new StackSpotService();
    }
    return StackSpotService.instance;
  }

  // Gera um ID único para cada sessão da página (F5 = nova sessão)
  private getSessionId(): string {
    if (!this.sessionId) {
      this.sessionId = `session_${Date.now()}_${Math.random()
        .toString(36)
        .substring(7)}`;
      console.log("🆕 [CLIENT] Nova sessão iniciada:", this.sessionId);
    }
    return this.sessionId;
  }

  async sendMessage(message: string): Promise<string> {
    console.log(
      "🚀 [CLIENT] Enviando mensagem para StackSpot Agent via API route"
    );
    console.log("📝 [CLIENT] Mensagem do usuário:", message);

    const sessionId = this.getSessionId();
    console.log("🔑 [CLIENT] Usando Session ID:", sessionId);

    try {
      // Envia para nossa API route no servidor (onde as credenciais estão seguras)
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-ID": sessionId, // Adiciona header com ID da sessão
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          "❌ [CLIENT] Erro na API route:",
          response.status,
          errorData
        );
        throw new Error(errorData.error || `Erro ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ [CLIENT] Resposta recebida:", data);

      // Mostra de onde veio a resposta para debug
      switch (data.source) {
        case "stackspot-agent":
          console.log(
            "🎯 [CLIENT] Resposta do seu agente personalizado StackSpot!"
          );
          console.log("🤖 [CLIENT] Agent ID usado:", data.agent_id);
          break;
        case "fallback":
          console.warn(
            "⚠️ [CLIENT] Usando resposta de fallback (credenciais não configuradas no servidor)"
          );
          break;
        case "stackspot-error":
          console.error("❌ [CLIENT] Erro na API StackSpot no servidor");
          break;
        case "error-fallback":
          console.error("❌ [CLIENT] Erro geral no servidor, usando fallback");
          break;
      }

      return data.response;
    } catch (error) {
      console.error("❌ [CLIENT] ERRO ao comunicar com API route:", error);

      // Fallback local em caso de erro total na comunicação
      return this.getLocalFallback(message);
    }
  }

  // Fallback local simplificado
  private getLocalFallback(message: string): string {
    console.warn(
      "⚠️ [CLIENT] Usando fallback local - problema na comunicação com servidor"
    );

    const lowercaseMessage = message.toLowerCase();

    if (
      lowercaseMessage.includes("carreira") ||
      lowercaseMessage.includes("profissional")
    ) {
      return `[FALLBACK LOCAL] Sobre desenvolvimento de carreira: É importante focar no aprendizado contínuo e networking. Para sua pergunta sobre "${message}", recomendo começar identificando suas principais habilidades e áreas de interesse.`;
    }

    if (
      lowercaseMessage.includes("tecnologia") ||
      lowercaseMessage.includes("programação")
    ) {
      return `[FALLBACK LOCAL] Na área de tecnologia, é essencial manter-se atualizado. Sugiro focar em: 1) Fundamentos sólidos, 2) Prática constante, 3) Contribuições open source, 4) Networking na comunidade tech.`;
    }

    return `[FALLBACK LOCAL] Obrigado pela sua pergunta sobre "${message}". Como especialista em orientação de carreira, posso te ajudar com desenvolvimento profissional, planejamento de carreira, transições e habilidades técnicas. Configure as credenciais StackSpot para respostas personalizadas.`;
  }

  // Limpa qualquer cache (não necessário mais, mas mantido para compatibilidade)
  clearAuth(): void {
    console.log(
      "🧹 [CLIENT] Cache limpo (autenticação agora é feita no servidor)"
    );
  }
}

export default StackSpotService;
