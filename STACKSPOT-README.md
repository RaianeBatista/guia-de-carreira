Como trocar de conta StackSpot (local) e testar

1. Crie um arquivo `.env.local` na raiz do projeto (não commite este arquivo).

   - Copie o conteúdo de `.env.local.sample` e cole em `.env.local`.
   - Preencha `STACKSPOT_CLIENT_ID`, `STACKSPOT_CLIENT_SECRET`, `NEXT_PUBLIC_STACKSPOT_REALM`, e `NEXT_PUBLIC_STACKSPOT_AGENT_ID` com as credenciais da nova conta.

2. Reinicie o servidor de desenvolvimento Next.js:

   - Se estiver usando a task do VS Code ("Next.js Development Server"), pare e reexecute a task.
   - Ou no terminal:

```cmd
npm run dev
```

3. Teste a autenticação com uma chamada simples (PowerShell ou cmd):

```powershell
# Substitua por uma mensagem de teste
$body = @{ message = "Teste de autenticação" } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:3000/api/chat -Method POST -Headers @{"Content-Type" = "application/json"; "X-Session-ID" = "test-session" } -Body $body
```

Ou com curl (Windows cmd via Git Bash ou WSL):

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -H "X-Session-ID: test-session" \
  -d '{"message":"Teste de autenticação"}'
```

4. Verifique o log do servidor (terminal rodando `npm run dev`) para confirmar:

   - Mensagem "🔑 [SERVER] Autenticando com StackSpot..."
   - Logs mostrando `CLIENT_ID configurado: true` e `CLIENT_SECRET configurado: true`
   - Log mostrando `✅ [SERVER] Autenticação bem-sucedida!`

5. Se a autenticação falhar, verifique:

   - Variáveis no `.env.local` sem espaços em branco extras
   - `REALM` correto
   - Se o `CLIENT_ID`/`CLIENT_SECRET` pertencem ao realm correto

6. (Opcional) Implementar rota administrativa segura para alternar agent/credenciais em runtime — me avise se quiser que eu implemente esta funcionalidade (requer proteção com senha ou token).

Se quiser, posso:

- Reiniciar a task do Next.js para você (posso instruir como ou rodar o comando no terminal aqui).
- Implementar rota admin para alternar contas em runtime.
- Fazer um teste de autenticação e mostrar os logs do servidor.
