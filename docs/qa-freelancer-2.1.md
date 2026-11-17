# rick_dev Freelancer 2.1 — validação técnica

**Resultado CONDITIONAL.** Escala e catálogo aprovados na verificação técnica. A validação assistiva, o Safari no iPhone, o Supabase gerenciado, as métricas de campo e o aceite visual do proprietário permanecem pendentes.

## Base e cobertura

Base de comparação `eea00c5`, o terceiro commit do PR #1 na branch `feat/freelancer-2-auditoria`. Os commits anteriores eram `ac570be` e `93f237b`. A base do PR era a main em `75b3e19`. Os 17 testes Node passaram na base e no candidato. O build Vite foi executado localmente com o prefixo de publicação `/rick-dev-freelancer/`. As verificações usaram o build local por HTTP e dados sintéticos.

Referência de qualidade aplicada: RICK_DEV Design Excellence V9.1.1 Modal Focus, identificada pela revisão do pacote e seção de foco em diálogo, embora o front matter conserve `9.1.0`. O pacote passou em 44 testes. O catálogo, o roteamento, as referências oficiais, o protocolo de aceite e o validador de cobertura foram usados como fonte. O arquivo de configuração específico de projeto não estava presente na base. A identidade publicada no código e o contrato da auditoria 2.0 fundamentam a comparação. As 36 combinações de cada rodada foram executadas por Playwright com base no roteiro do portfólio. Em execução complementar por HTTP, o Automated Visual Review do pacote registrou 78 PASS, 0 FAIL, 0 BLOCKED e 12 NOT TESTED em cada uma das rotas Home, Contato e case, antes e depois. A heurística própria de contraste de fundo sólido não detectou o cenário transitório encontrado pelo axe.

| Escopo | PASS | PARTIAL | FAIL | NOT APPLICABLE | BLOCKED | NOT TESTED |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 2.0 após correções | 43 | 12 | 2 | 27 | 0 | 51 |
| 2.1 depois da revisão | 73 | 32 | 0 | 29 | 1 | 0 |
| Apenas os 51 pendentes da 2.0 | 28 | 20 | 0 | 2 | 1 | 0 |

A [matriz de 135 requisitos](coverage-freelancer-2.1.csv) indica a seção pelo ID, a origem de cada observação e a limitação individual. A coluna Fonte marca avaliações herdadas da 2.0 sem atribuir a elas uma nova execução. O validador oficial retornou 135 itens, zero erros de estrutura e CONDITIONAL. Para o formato oficial, PARTIAL e BLOCKED são representados como `not_tested`, com o estado humano preservado. Por isso, zero NOT TESTED na tabela não equivale a cobertura integral.

DS-05-09 trata da existência e funcionamento de modais, drawers e popovers. O menu móvel é uma divulgação acionada por botão. A edição e revisão são rotas, e o painel de mensagens é uma página própria. DS-07-05 trata exclusivamente de entrada e saída de modais. Os 12 cenários anteriores (seis larguras e duas preferências de movimento) ficam fora do escopo. O foco do menu, dos campos, do resumo e das rotas continuou sendo avaliado separadamente.

## Correções verificadas

| Critério | Alteração | Evidência |
| --- | --- | --- |
| DS-03-01 | Primitivos e aliases de espaçamento em `src/styles/spacing.css`, adotados em navegação, botões, cards, seções e formulários. | Escala documentada e comparação de 39 pares Chromium. |
| DS-11-02 | [Catálogo real dos componentes](design-system.md), com finalidade, variantes, estados, tokens, responsividade, acessibilidade e exemplos. | Catálogo versionado fora da aplicação pública. |
| DS-01-05 / DS-08-08 | A entrada anima apenas a imagem do case. A opacidade composta da legenda permanece estável. | Antes, axe identificou contraste aproximado de 3,7:1 na legenda a 1440 px durante a entrada. Depois, o teste registra opacidade 1 no figure e na legenda, e zero alertas na mesma amostra. |

## Acessibilidade e compatibilidade

| Ambiente | Resultado observado |
| --- | --- |
| Chromium 153.0.8010.0 headless em Linux | 36 combinações de páginas e larguras. Sem overflow, erros de console ou falhas de recursos registradas. Axe em seis rotas e duas larguras: 1 grupo antes e 0 depois. |
| WebKit WPE 26.5 headless em Linux | 36 combinações, com toque habilitado no contexto. Candidato sem overflow, erros de console ou falhas de recursos registradas. Compatibilidade limitada ao motor usado. Dependências foram disponibilizadas em diretório temporário. |
| Safari no iPhone físico | BLOCKED. O ambiente Linux não oferece dispositivo Apple. Inclui o handoff ao WhatsApp e zoom nativo. |
| VoiceOver, NVDA e Orca | BLOCKED. Não havia leitor de tela executável neste ambiente. Axe e teclado foram executados separadamente. |

Foram verificadas as larguras de 320, 375, 390, 768, 1024 e 1440 px em Home, Serviços, Projetos, Sobre, Contato e no case. O fluxo confirmou link de serviço com preenchimento prévio, cinco campos preservados ao voltar, edição do briefing, erro associado ao campo e foco inicial no resumo visível. O botão do WhatsApp coube inteiro a 320 px. Na revisão, o envio fica desabilitado até o consentimento. O teste verificou filtro de projetos, abertura do menu por teclado e retorno de foco ao pressionar Escape. A entrada do case dura 240 ms em movimento normal e a animação é removida com a preferência reduzida.

### Roteiro para aceite manual assistivo

1. Em iPhone, registre modelo, versão do iOS, Safari e método de navegação. Com VoiceOver ligado, passe pelas cinco páginas usando o rotor de títulos e depois o de links. Confirme um título principal por página, os rótulos da navegação e a ordem de leitura.
2. Abra e feche o menu móvel por toque e, se disponível, por teclado. no NVDA em Windows, use `Tab`, `Shift+Tab`, `Enter`, `Escape` e modo de navegação. Acompanhe os anúncios de expansão e o retorno do foco ao acionador.
3. Em Contato, teste o WhatsApp até a abertura do app ou da página de destino. Volte sem enviar mensagem. Preencha os cinco campos com dados sintéticos. Primeiro omita um obrigatório e confira se o leitor anuncia o rótulo e a mensagem associada.
4. Gere o resumo. O título deve receber foco e ser anunciado. Abra a revisão e use Editar briefing. Confira os cinco valores e gere o resumo novamente. Confira a descrição do consentimento e a disponibilidade do envio, sem submeter à produção.
5. Abra o case NØVA STREET. Confira título, texto alternativo, legenda e link da demonstração. Ative Reduzir Movimento e repita. Registre captura ou transcrição com etapa, resultado esperado e resultado observado.

## Supabase e jornada de envio

A integração existente usa cliente público e Edge Function. O formulário exige consentimento, mostra estado de espera, mantém erro recuperável e gera código de conversa. O handler valida payload, aplica limites e concentra acesso em RPC do banco. A chave de serviço pertence ao servidor. O frontend guarda o código pendente na sessão para reutilizá-lo em uma tentativa após falha.

PASS isolado em PostgreSQL 18.6 (PGlite 0.5.16). As três migrations versionadas e o handler real foram executados com um adaptador local da API. Payload inválido retornou 400. A falha simulada após gravar retornou 503. O retry com o mesmo código retornou 201; a leitura retornou 200 e confirmou exatamente um pedido e uma mensagem. RLS ficou ativo em três tabelas. Leitura e RPC anônimas e escrita direta do cliente autenticado foram negadas. A função com papel de serviço estava habilitada.

```bash
npm test
# Com @electric-sql/pglite@0.5.16 instalado em uma pasta de teste isolada:
PGLITE_MODULE=/caminho/node_modules/@electric-sql/pglite/dist/index.js node scripts/audit-mailbox-db.mjs
```

Supabase gerenciado BLOCKED. A configuração inspecionada aponta para produção e não havia ambiente gerenciado de teste para gravar com segurança. A execução isolada não cobre a publicação da Edge Function, o gateway do fornecedor ou a rede real. Nenhum pedido ou mensagem foi enviado para produção.

## Performance

Laboratório em Chromium 153, viewport 390 × 844, CPU limitada a 4×, HTTP local sem limitação de rede. Três contextos frios por rota e versão, observados após renderização e carregamento de fontes. Medianas.

| Página | LCP antes → depois | FCP antes → depois | CLS antes → depois |
| --- | ---: | ---: | ---: |
| Home | 316 → 316 ms | 316 → 316 ms | 0 → 0 |
| Contato | 244 → 240 ms | 244 → 240 ms | 0 → 0 |
| Case NØVA STREET | 248 → 252 ms | 248 → 252 ms | 0 → 0 |

O JS permaneceu em 96,01 kB gzip e o CSS passou de 7,16 para 7,49 kB gzip. As duas fontes locais somam aproximadamente 61,5 kB e a imagem do case, 47,8 kB em disco. Não se constatou gargalo novo nesta amostra. Lighthouse bloqueou na inicialização de depuração. TBT de Lighthouse permanece sem medida. Os eventos observados na abertura e fechamento do menu (16–32 ms) constituem uma amostra de interação, insuficiente para informar INP do portfólio. Sem métricas de usuários reais, use os resultados acima somente como linha de base de laboratório.

## Revisão visual do proprietário

As capturas comparativas registram 39 pares Chromium, incluindo o resumo de briefing e o case alcançado pelo CTA. Na rodada final, todos os 39 pares tiveram pixels idênticos em estado estabilizado. O teste de movimento separado confere o que muda durante a transição. Os arquivos WebKit complementam a revisão.

Para o aceite, confira a legibilidade da legenda durante a entrada do case, a preservação da identidade clara e azul e a ordem dos canais do resumo em mobile. Registre a aprovação visual no PR depois de revisar os pares. Esse aceite está pendente.
