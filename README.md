# rick_dev Freelancer
Portfólio comercial em React + Vite + CSS puro, com caixa de mensagens em backend Supabase separado.

## Executar
`npm install` e `npm run dev`.

## Validar
`npm test` e `npm run build`.

## Estrutura
- `src/pages`: as cinco páginas
- `src/components`: elementos compartilhados
- `src/data`: projetos e serviços
- `src/lib`: criação e validação do briefing

## Contato e mensagens
O visitante prepara um briefing e escolhe entre Site, WhatsApp ou email. O envio pelo site grava a conversa no backend e retorna acesso por código privado (256 bits). Somente o hash do código é persistido no banco. Sem código não há recuperação pública; não há notificações por email. O código fica lembrado na aba enquanto aberta, quando sessionStorage está disponível.

- `/mensagens`: acompanhar e responder com o código privado.
- `/painel`: área exclusiva do proprietário, com autenticação Supabase e email confirmado `douglasxxxbarbosa@gmail.com` verificado no servidor.
- Primeiro acesso: no dashboard Supabase do projeto `xqtqobtmxuekrdrlpnxr`, Authentication → Users → Add user → Create new user; definir email do proprietário, senha exclusiva e confirmar email. A senha é definida pelo proprietário e nunca deve ser enviada no chat ou no código.
- Se a sessão expirar ao responder, o login aparece na conversa e preserva o rascunho.

## Backend
`backend/setup.sql` é o esquema inicial aplicado; `backend/mailbox-reliability.sql` acrescenta idempotência de respostas. `backend/mailbox/index.ts`, `handler.js` e `validation.js` compõem a Edge Function `mailbox` (verify_jwt=false porque valida códigos privados e tokens de usuário no próprio handler). Tabelas têm RLS e nenhum acesso anon/authenticated: apenas a função de servidor acessa dados após validar permissão. Não adicionar políticas públicas para remover o aviso informativo “RLS sem políticas”.

Chave publishable no front-end é pública por design. Nenhuma credencial de servidor é enviada ao navegador. Configurar novos domínios no allowlist CORS do handler ao migrar o site. O domínio GitHub `rick-dev-rick.github.io` já está previsto.

## Verificação
Testes unitários de isolamento/autorização e erros; integração com banco real verificou criação, leitura correta, rejeição de códigos incorretos, repetição sem duplicar, e acesso direto anônimo negado. UI verificada com envio real, atualização e recuperação por recarregamento em aba. Mensagens sintéticas removidas após verificação. O login do proprietário depende da criação da conta pelo próprio usuário e ainda precisa ser conferido por ele.

Os previews dos projetos são ilustrações em CSS. Links levam aos projetos ou repositórios reais.

## Status de atendimento
O painel filtra Em atendimento, Finalizadas e Todas. Somente o proprietário autenticado pode finalizar/reabrir. O status e a data de conclusão ficam no banco, sem alterar o histórico. Uma nova mensagem reabre a conversa; retry idempotente de mensagem antiga não reabre. A migração adicional está em `backend/mailbox-status.sql`.
