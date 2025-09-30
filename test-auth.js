// Teste rápido das credenciais StackSpot
// Este arquivo é apenas para verificação - pode ser deletado depois

async function testStackSpotAuth() {
  const REALM = "stackspot-freemium";
  const CLIENT_ID = "2147c7ad-6763-40b4-b74b-cf918320148a";
  const CLIENT_SECRET =
    "EIeu8l6oEETYQ8y50HE4PQlAfO2Sl7mRvN3W8b5HqMk64MejK5Hs1UQ000l2JST3";

  try {
    const authUrl = `https://idm.stackspot.com/${REALM}/oidc/oauth/token`;

    const formData = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    });

    const response = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Autenticação StackSpot funcionando!");
      console.log("Token:", data.access_token?.substring(0, 20) + "...");
      return true;
    } else {
      console.error(
        "❌ Erro na autenticação:",
        response.status,
        response.statusText
      );
      return false;
    }
  } catch (error) {
    console.error("❌ Erro na requisição:", error);
    return false;
  }
}

// Teste específico do agente
async function testAgentChat() {
  const REALM = "stackspot-freemium";
  const CLIENT_ID = "2147c7ad-6763-40b4-b74b-cf918320148a";
  const CLIENT_SECRET =
    "EIeu8l6oEETYQ8y50HE4PQlAfO2Sl7mRvN3W8b5HqMk64MejK5Hs1UQ000l2JST3";
  const AGENT_ID = "01K5RTDWRXJFW8R9EGCRGGQ3XX";

  try {
    // Primeiro, autentica
    console.log("🔑 Autenticando...");
    const authUrl = `https://idm.stackspot.com/${REALM}/oidc/oauth/token`;

    const formData = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    });

    const authResponse = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!authResponse.ok) {
      console.error("❌ Erro na autenticação:", authResponse.status);
      return false;
    }

    const authData = await authResponse.json();
    console.log("✅ Autenticado com sucesso!");

    // Agora testa o chat com o agente
    console.log("🤖 Testando chat com agente:", AGENT_ID);
    const chatUrl = `https://genai-inference-app.stackspot.com/v1/agent/${AGENT_ID}/chat`;

    const chatPayload = {
      streaming: false,
      user_prompt: "Olá! Como você pode me ajudar com orientação de carreira?",
      stackspot_knowledge: true,
      return_ks_in_response: true,
    };

    console.log("📤 Enviando para:", chatUrl);
    console.log("📦 Payload:", chatPayload);

    const chatResponse = await fetch(chatUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authData.access_token}`,
      },
      body: JSON.stringify(chatPayload),
    });

    console.log("📥 Status da resposta:", chatResponse.status);

    if (!chatResponse.ok) {
      const errorText = await chatResponse.text();
      console.error("❌ Erro no chat:", chatResponse.status, errorText);
      return false;
    }

    const chatData = await chatResponse.json();
    console.log("✅ Resposta completa do agente:", chatData);

    if (chatData.choices && chatData.choices.length > 0) {
      console.log(
        "🎯 Mensagem do seu agente personalizado:",
        chatData.choices[0].message.content
      );
      return true;
    }

    return false;
  } catch (error) {
    console.error("❌ Erro no teste:", error);
    return false;
  }
}

// Execute estes testes no console do navegador
console.log("🔧 Testes carregados:");
console.log("- testStackSpotAuth() - Testa autenticação");
console.log("- testAgentChat() - Testa chat com seu agente personalizado");
window.testStackSpotAuth = testStackSpotAuth;
window.testAgentChat = testAgentChat;
