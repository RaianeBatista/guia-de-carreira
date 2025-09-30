# 🔧 Configuração da Integração StackSpot

Este guia te ajudará a configurar a integração real com a API StackSpot usando suas credenciais.

## 📋 Pré-requisitos

1. **Conta StackSpot** com acesso ao agente de orientação de carreira
2. **Credenciais de autenticação** (Client ID, Client Secret, Realm)
3. **ID do agente** já configurado na plataforma StackSpot

## 🚀 Configuração Passo a Passo

### 1. Obter Credenciais StackSpot

1. Acesse sua conta no [StackSpot](https://stackspot.com)
2. Navegue até as configurações de API/Integração
3. Gere ou obtenha suas credenciais:
   - **Realm**: Seu realm/organização
   - **Client ID**: Identificador do cliente
   - **Client Secret**: Chave secreta (mantenha segura!)
   - **Agent ID**: ID do seu agente (você forneceu: `01K5RTDWRXJFW8R9EGCRGGQ3XX`)

### 2. Configurar Variáveis de Ambiente

1. **Copie o arquivo de exemplo:**

   ```bash
   cp .env.example .env.local
   ```

2. **Edite o arquivo `.env.local`:**

   ```env
   # URLs da API StackSpot (normalmente não precisam ser alteradas)
   NEXT_PUBLIC_STACKSPOT_IDM_URL=https://idm.stackspot.com
   NEXT_PUBLIC_STACKSPOT_INFERENCE_URL=https://genai-inference-app.stackspot.com

   # Configure com suas credenciais reais
   NEXT_PUBLIC_STACKSPOT_REALM=seu-realm-aqui
   STACKSPOT_CLIENT_ID=seu-client-id-aqui
   STACKSPOT_CLIENT_SECRET=seu-client-secret-aqui

   # ID do agente (já configurado)
   NEXT_PUBLIC_STACKSPOT_AGENT_ID=01K5RTDWRXJFW8R9EGCRGGQ3XX
   ```

### 3. Testar a Integração

1. **Reinicie o servidor de desenvolvimento:**

   ```bash
   npm run dev
   ```

2. **Acesse http://localhost:3000**

3. **Teste uma mensagem** - se as credenciais estiverem corretas, você receberá respostas reais do agente StackSpot

## 🔍 Verificação da Configuração

### ✅ Integração Funcionando Corretamente

Se tudo estiver configurado corretamente, você verá:

- Respostas personalizadas do seu agente StackSpot
- Tempo de resposta mais longo (requisições reais)
- Logs no console do navegador indicando sucesso

### ❌ Problemas Comuns

**1. Credenciais Inválidas:**

```
Erro na autenticação: 401 Unauthorized
```

**Solução:** Verifique CLIENT_ID, CLIENT_SECRET e REALM

**2. Agente não encontrado:**

```
Erro na API StackSpot: 404 Not Found
```

**Solução:** Verifique se o AGENT_ID está correto

**3. Usando respostas simuladas:**

```
Credenciais StackSpot não configuradas, usando fallback
```

**Solução:** Configure todas as variáveis de ambiente necessárias

## 🛠️ Desenvolvimento e Debug

### Logs e Monitoramento

A integração inclui logs detalhados. Abra o **Console do Navegador (F12)** para ver:

- Status da autenticação
- Requisições à API
- Erros detalhados
- Uso de fallbacks

### Fallback para Desenvolvimento

Se as credenciais não estiverem configuradas, a aplicação usa **respostas simuladas inteligentes** baseadas em palavras-chave. Isso permite desenvolvimento sem credenciais reais.

### Customizações Adicionais

Para personalizar a integração, edite `src/lib/stackspot-service.ts`:

- **Timeout de requisições**
- **Retry logic**
- **Processamento de streaming**
- **Cache de respostas**

## 🔒 Segurança

### Importantes:

1. **NUNCA** commite o arquivo `.env.local`
2. **Mantenha** CLIENT_SECRET seguro
3. **Use** variáveis de ambiente em produção
4. **Monitore** uso da API para evitar abusos

### Exemplo de Deploy (Vercel):

```bash
# Configure as variáveis no dashboard da Vercel
vercel env add STACKSPOT_CLIENT_ID
vercel env add STACKSPOT_CLIENT_SECRET
vercel env add NEXT_PUBLIC_STACKSPOT_REALM
```

## 📞 Suporte

Se encontrar problemas:

1. **Verifique as credenciais** na plataforma StackSpot
2. **Consulte os logs** do navegador para erros específicos
3. **Teste a API** diretamente usando curl (como no exemplo fornecido)
4. **Documente o erro** e entre em contato com o suporte StackSpot

---

**Próximo Passo:** Configure suas credenciais em `.env.local` e teste a integração!
