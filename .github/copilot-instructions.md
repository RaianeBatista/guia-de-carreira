# Instruções para GitHub Copilot - Guia de Carreira StackSpot

Este é um projeto Next.js que implementa uma interface de chat para um agente de orientação de carreira da StackSpot.

## Contexto do Projeto

- **Tecnologias**: Next.js 15, React, TypeScript, Tailwind CSS
- **Funcionalidade Principal**: Interface de chat para orientação profissional
- **Integração**: API StackSpot para processamento de mensagens
- **Tema**: Orientação de carreira, desenvolvimento profissional, tecnologia

## Padrões de Código

### Componentes React

- Use TypeScript com interfaces bem definidas
- Componentes funcionais com hooks
- Props tipadas com interfaces
- Use "use client" quando necessário (interatividade)

### Styling

- Tailwind CSS para todas as estilizações
- Design responsivo (mobile-first)
- Suporte a modo escuro (dark:)
- Gradientes e sombras modernas

### Integração StackSpot

- Serviço centralizado em `src/lib/stackspot-service.ts`
- Configuração via variáveis de ambiente
- Tratamento de erros robusto
- Fallbacks para desenvolvimento

## Estrutura de Arquivos

```
src/
├── app/                    # Next.js App Router
├── components/            # Componentes React reutilizáveis
└── lib/                   # Utilitários e serviços
```

## Convenções de Nomenclatura

- Componentes: PascalCase (ex: `ChatInterface.tsx`)
- Arquivos de serviço: kebab-case (ex: `stackspot-service.ts`)
- Variáveis/funções: camelCase
- Constantes: UPPER_CASE

## Funcionalidades Implementadas

1. **Interface de Chat**

   - Mensagens de usuário e assistente
   - Estados de loading
   - Scroll automático
   - Input com suporte a Enter/Shift+Enter

2. **Integração StackSpot**

   - Serviço para comunicação com API
   - Gerenciamento de sessões
   - Configuração via env vars
   - Respostas de fallback

3. **UI/UX**
   - Header com branding
   - Layout responsivo
   - Gradientes e visual moderno
   - Modo escuro

## Variáveis de Ambiente

- `NEXT_PUBLIC_STACKSPOT_API_URL`: URL da API StackSpot
- `NEXT_PUBLIC_STACKSPOT_AGENT_ID`: ID do agente
- `STACKSPOT_API_KEY`: Chave de API (server-side)

## Próximas Funcionalidades Sugeridas

- Histórico de conversas
- Autenticação de usuários
- Exportação de conversas
- Métricas de uso
- Compartilhamento de respostas

## Boas Práticas

1. Sempre tipar props e states
2. Usar error boundaries para componentes
3. Implementar loading states
4. Validar inputs do usuário
5. Logs apropriados para debugging
6. Testes unitários para componentes críticos

## Integração com StackSpot

Ao trabalhar com a API StackSpot:

- Sempre trate erros de rede
- Implemente timeouts apropriados
- Use retry logic quando apropriado
- Mantenha contexto de conversa
- Sanitize inputs do usuário
