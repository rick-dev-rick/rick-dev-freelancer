# rick_dev Freelancer
React + Vite + CSS puro, sem backend. Cinco páginas: Home, Serviços, Projetos, Sobre e Contato.
Identidade clara com grafite e azul profundo. Cases reais identificados como pessoais ou demonstrativos.
Contato: briefing local copiável e baixável. Links para WhatsApp e email autorizados, com resumo preenchido; envio confirmado pelo visitante no aplicativo externo. Sem coleta remota pelo formulário.
Verificação: testes do briefing, build de produção e navegação no navegador. Revisão de acessibilidade e responsividade.

## Revisão mobile e teclado
Prévia com iframe de 390px (375px úteis com scrollbar) e Home também em 320px. Serviços, Projetos, Sobre e Contato sem transbordamento horizontal observado. Menu e tecla Esc conferidos; troca de página leva foco ao conteúdo. Briefing válido gerado no navegador com URLs preenchidas, sem enviar mensagens. Campos usam fonte de 16px no mobile e controles principais têm alvo mínimo de 44px. A prévia não substitui testes em um iPhone físico.

## Correção de ícones no iOS
A gravação do usuário mostrou caracteres de seta renderizados como emoji azul e asterisco como emoji verde. Todos os indicadores de seta e símbolos da faixa usam agora o componente SVG Icon, com currentColor, aria-hidden e focusable=false. Prévia mobile: 25 SVGs na Home, nenhum dos caracteres de seta anteriores no texto e nenhum transbordamento horizontal. Teste em iPhone físico permanece com o usuário.
