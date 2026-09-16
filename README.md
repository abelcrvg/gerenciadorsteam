# Gerenciador Steam

Gerenciador de estoque para organização de contas e jogos Steam, preparado para funcionar no PC/web e Android usando a mesma base de dados.

## Status

🚧 **MVP em desenvolvimento**

### Web

A versão web já possui:

- Dashboard com indicadores do estoque
- Cadastro rápido de contas
- Lista e pesquisa de contas
- Status de disponibilidade, reserva e venda
- Associação de jogos às contas
- Valor do estoque
- Interface responsiva em tema escuro

### Android

Foi adicionada uma base nativa em **Kotlin + Jetpack Compose**, com:

- Dashboard mobile
- Lista de contas
- Navegação inferior
- Estrutura pronta para consumir o mesmo backend da versão web
- Dados de demonstração isolados da futura sincronização

### Backend compartilhado

A pasta `supabase/migrations` contém a primeira versão do modelo de dados para sincronização entre dispositivos:

- `accounts`: contas e dados operacionais
- `games`: catálogo de jogos
- `account_games`: relação entre contas e jogos
- `sales`: histórico de vendas
- RLS por usuário para impedir que um usuário acesse o estoque de outro

**Nenhuma senha ou chave real deve ser commitada no GitHub.** Credenciais e variáveis do Supabase devem ficar somente no ambiente local/de deploy.

## Arquitetura

```text
                 GERENCIADOR STEAM
                        │
          ┌─────────────┴─────────────┐
          │                           │
     Web / PC                    Android
 React + TypeScript          Kotlin + Compose
          │                           │
          └─────────────┬─────────────┘
                        │
                  Supabase / API
                        │
                    PostgreSQL
```

A ideia é que **web e Android não tenham estoques separados**. Ambos deverão consultar e alterar os mesmos registros autenticados no backend.

## Desenvolvimento web

```bash
npm install
npm run dev
```

Depois abra o endereço exibido pelo Vite.

## Desenvolvimento Android

Abra a pasta `android/` no Android Studio e sincronize o projeto Gradle. O módulo principal está em `android/app`.

O aplicativo atual usa dados de demonstração. A próxima integração deve substituir essa fonte local pelo backend compartilhado, mantendo a mesma estrutura de domínio.

## Próximas etapas

1. Conectar o projeto web ao Supabase
2. Implementar autenticação
3. Migrar as contas de demonstração para o banco
4. Cadastro completo de contas, incluindo campos sensíveis com acesso autenticado
5. Catálogo de jogos e relacionamento conta ↔ jogo
6. Vendas, reservas e histórico
7. Conectar o Android ao mesmo backend
8. Cache/offline no Android com sincronização posterior
9. Backup e restauração
10. Auditoria e melhorias de segurança
