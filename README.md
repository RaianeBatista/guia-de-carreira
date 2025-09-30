# Rumo Certo Brasil 🇧🇷

Uma interface web moderna para orientação de carreira desenvolvida pelas **Prompt Builders**. Este projeto oferece uma experiência de chat intuitiva com IA para receber conselhos personalizados sobre desenvolvimento profissional.

## ✨ Funcionalidades

- 💬 **Interface de Chat Moderna**: Chat responsivo e intuitivo com suporte a modo escuro
- 🤖 **Integração StackSpot AI**: Conectado ao seu agente especializado em orientação de carreira
- 📱 **Design Responsivo**: Funciona perfeitamente em desktop e mobile
- ⚡ **Performance Otimizada**: Construído com Next.js 15 e Tailwind CSS
- 🔒 **Configuração Segura**: Suporte a variáveis de ambiente para credenciais

## 🚀 Começando

### Pré-requisitos

- Node.js 18+
- npm, yarn, pnpm ou bun
- Agente StackSpot configurado com suas credenciais

### Instalação

1. **Clone o repositório:**

   ```bash
   git clone <url-do-repositorio>
   cd guia-carreira
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure as credenciais StackSpot:**

   📖 **[Veja o guia completo de integração](./INTEGRATION_GUIDE.md)**

   ```bash
   cp .env.example .env.local
   ```

   Configure suas credenciais reais no arquivo `.env.local`:

   ```env
   NEXT_PUBLIC_STACKSPOT_REALM=seu-realm
   STACKSPOT_CLIENT_ID=seu-client-id
   STACKSPOT_CLIENT_SECRET=seu-client-secret
   NEXT_PUBLIC_STACKSPOT_AGENT_ID=01K5RTDWRXJFW8R9EGCRGGQ3XX
   ```

4. **Execute o servidor de desenvolvimento:**

   ```bash
   npm run dev
   ```

5. **Acesse a aplicação:**
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🔧 Configuração da API StackSpot

### Obtendo as Credenciais

1. Acesse o [Portal StackSpot](https://stackspot.com)
2. Navegue até seus agentes configurados
3. Copie o **Agent ID** do seu agente de orientação de carreira
4. Gere uma **API Key** se ainda não possuir
5. Configure a **URL da API** (se usando endpoint personalizado)

### Estrutura da Integração

A integração está implementada em `src/lib/stackspot-service.ts` e inclui:

- ✅ Gerenciamento de sessões de conversa
- ✅ Tratamento de erros e fallbacks
- ✅ Configuração flexível via variáveis de ambiente
- ✅ Tipos TypeScript para type safety

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/            # Componentes React
│   ├── ChatInterface.tsx  # Interface do chat
│   └── Header.tsx         # Cabeçalho da aplicação
└── lib/                   # Utilitários e serviços
    └── stackspot-service.ts # Serviço de integração StackSpot
```

## 🎨 Personalização

### Modificando o Visual

O projeto usa Tailwind CSS. Para personalizar:

1. **Cores e tema**: Edite `tailwind.config.ts`
2. **Componentes**: Modifique os arquivos em `src/components/`
3. **Layout**: Ajuste `src/app/layout.tsx` e `src/app/page.tsx`

### Customizando Respostas

Para personalizar o comportamento do assistente:

1. Edite o prompt do seu agente no Portal StackSpot
2. Ajuste as respostas de fallback em `stackspot-service.ts`
3. Configure mensagens iniciais em `ChatInterface.tsx`

## 🚀 Deploy

### Vercel (Recomendado)

```bash
npm run build
# Deploy via Vercel CLI ou conecte o repositório no dashboard
```

### Outros Providers

```bash
npm run build
npm start
```

## 🛠️ Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run start` - Servidor de produção
- `npm run lint` - Verificação de linting

## 📝 Próximos Passos

- [ ] Implementar autenticação de usuários
- [ ] Adicionar histórico de conversas
- [ ] Exportar conversas em PDF
- [ ] Métricas de uso e analytics
- [ ] Suporte a múltiplos idiomas

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 💬 Suporte

Para dúvidas ou suporte:

- 📧 Email: [seu-email@domain.com](mailto:seu-email@domain.com)
- 💼 LinkedIn: [seu-perfil-linkedin](https://linkedin.com/in/seu-perfil)
- 🐙 Issues do GitHub: [Criar issue](https://github.com/seu-usuario/guia-carreira/issues)

---

**🇧🇷 Desenvolvido com ❤️ pelas Prompt Builders**  
*4 estudantes brasileiras especializadas em engenharia de prompts e IA*

Tecnologias: [StackSpot](https://stackspot.com) • [Next.js](https://nextjs.org) • TypeScript • Tailwind CSS
