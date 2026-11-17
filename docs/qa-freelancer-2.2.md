# rick_dev Freelancer 2.2 — correções e refinamento

**Resultado CONDITIONAL.** As correções prioritárias foram reproduzidas e revalidadas no build local. O aceite visual do proprietário está pendente.

## Base do trabalho

Repositório `rick-dev-rick/rick-dev-freelancer`, PR #1, branch `feat/freelancer-2-auditoria`. A base desta revisão é `ef6b78a`, com os cinco commits das etapas 2.0 e 2.1. A main estava em `75b3e19`. As mudanças foram realizadas em worktree isolado, sem sobrepor a 2.1.

Fontes consultadas incluem diagnóstico V9, relatório e matrizes antes/depois 2.0, [relatório 2.1](qa-freelancer-2.1.md), [matriz 2.1](coverage-freelancer-2.1.csv), evidências visuais, aceites, resultados do axe e Automated Visual Review. As observações novas são explicitadas na tabela abaixo. A RICK_DEV Design Excellence V9.1.1 Modal Focus passou em 44 testes de integridade. Conteúdos críticos instalados correspondem ao ZIP original, cujo SHA-256 é `b600c592f627e8cc1c76a42ca3ab91854328204a08d09a71fb90b4ae6840643e`. A revisão de modais está presente, embora o front matter ainda declare 9.1.0. O preflight manteve bloqueadas operações que dependem de configuração de projeto ausente. A identidade foi derivada do código aprovado e do briefing, sem carregar presets de terceiros.

## Reavaliação do diagnóstico V9

| Achado | Verificação 2.2 |
| --- | --- |
| A01, A07 — contraste e semântica | Preservados. Zero grupos axe nas seis rotas × duas larguras, na base e no candidato. H2 dos cards e nomes de links conferidos. |
| A02, A03, A04 — retorno do briefing, dobra do WhatsApp, resumo e erro | Preservados. Cinco campos voltam e o resumo pode ser editado. WhatsApp termina em y=456 em tela de 844 px a 320 px. Título do resumo recebe foco e fica visível. A separação entre nome acessível e descrição do erro foi refinada. |
| A05, A06 — case e destinos de serviços | Preservados. Home abre o case, a captura decodifica e o link de demonstração está presente. Cartão de serviço leva à seção correspondente. Os três CTAs de orçamento preenchem o serviço correto. |
| A08 — legibilidade dos filtros e alvos do rodapé | Reproduzido e corrigido. Os botões de filtro usavam 9 px, e seis links de rodapé tinham 12 px de altura. |
| A09 — fontes e bundle | WOFF2 locais preservados. Descoberta tardia provocava deslocamento em Contato. Pré-carregamento dos arquivos já existentes corrigiu a instabilidade no laboratório. Separar rotas operacionais foi avaliado, mas permanece pendente de uma medição que justifique a complexidade e o custo no fluxo comercial. |
| A10 — compartilhamento | A Home ganhou canonical e título, descrição, URL, tipo e idioma do Open Graph. O build confirma os metadados. Uma imagem de prévia, teste em aplicativos de mensagem e indexação individual das rotas por hash permanecem pendentes. |
| A11 — tokens e catálogo | A escala e o catálogo da 2.1 foram mantidos. Espaçamentos novos usam tokens existentes e o catálogo registra alvos e feedback do briefing. Escala formal de raios, elevação, espessura e tipografia completa permanece parcial. |
| A12 — movimento reduzido | Mantido. A imagem do case anima em 240 ms em modo normal. A legenda fica estável, e a preferência reduzida remove a entrada e o deslocamento no hover. |
| A13 — exemplos e prova de trabalho | Cada serviço ganhou um exemplo ilustrativo com CTA. Sobre aponta diretamente à decisão de busca e filtros compartilháveis do case. Os cards deixam mais claro o propósito de cada projeto. |

## Correções e refinamentos

| Prioridade e tipo | Problema ou oportunidade | Alteração, requisito e evidência |
| --- | --- | --- |
| P1 · Correção | No Contato, o rótulo envolvia também o texto de erro. A árvore acessível mostrava “Seu nome * Informe seu nome.” no nome do campo. | Rótulo associado explicitamente e a mensagem permanece na descrição, com foco no inválido. O nome agora é “Seu nome”. DS-05-02, DS-06-03, DS-08-12. |
| P1 · Correção | Ao negar acesso ao clipboard, o aviso aparecia acima do resumo e fora da tela, em y≈−542 a 320 × 844. | Status de copiar e baixar junto aos botões. O aviso apareceu em y≈400 no Chromium e no WebKit, com o foco no botão. Cópia com stub e download local também foram exercitados. DS-04-05, DS-05-10, DS-05-11, DS-06-05. |
| P1 · Correção | Em carregamento frio a 390 px, a troca de fonte mudava o link de e-mail de linha e deslocava o formulário. A seção foi de y≈509 para y≈565 em uma amostra. | Pré-carregamento dos dois WOFF2 existentes com URL resolvida pelo Vite. CLS da página caiu de 0,1455 para 0 em três repetições por versão. DS-02-01, DS-08-10, DS-10-15. |
| P2 · Correção | Filtros mobile com texto a 9 px e alvos secundários do rodapé medindo 12 px de altura. | Texto de filtro a 12 px e os três controles em uma linha a 320 px. Seis links do rodapé passaram a 44 px de altura. CTAs de Serviços também recebem altura mínima de 44 px no mobile. DS-02-06, DS-05-08, DS-08-04. |
| P2 · Refinamento | Serviços oferecia escopo sem mostrar um exemplo de entrega; Projetos e Sobre podiam identificar melhor a decisão de interface ou o destino do link. | Três exemplos concretos, CTAs contextuais, links do catálogo com nomes específicos e referência a uma decisão do case. Capturas e rotas confirmam as alterações. Não houve teste de conversão. DS-04-01, DS-04-03, DS-04-06. |
| P2 · Refinamento | O HTML da Home tinha apenas descrição genérica para compartilhamento. | Canonical para o endereço público e Open Graph textual verificados no HTML gerado. DS-10-11. |

Não houve bloqueador P0 reproduzido no recorte. Para o feedback foi comparado o aviso global existente, um aviso flutuante e um status inline. A região inline é visível no mesmo enquadramento do botão, preserva a posição de leitura e dispensa temporizador. Para Projetos, aumentar só a fonte ocupava duas linhas em 320 px. O rótulo “Todos” preserva o nome acessível mais descritivo e mantém a linha única. Não foi escolhida nenhuma exploração que alterasse identidade ou estrutura. A verificação de movimento usou as receitas de movimento reduzido e o revisor automatizado. Os testes da entrada existente sustentaram manter o efeito e não adicionar animação ao feedback.

## Jornadas e evidências

| Jornada | Resultado observado |
| --- | --- |
| A — procurar um site | Cada opção de serviço expõe exemplo e orçamento. Os três destinos do orçamento mantêm o serviço no formulário. |
| B — avaliar projetos | Filtro funciona em sequência 3 → 2 → 3. O case é acessível pela Home, pelo catálogo e pela prova contextual no Sobre. Demo e código têm destinos distintos na interface. |
| C — entrar em contato pelo celular | Menu abre e fecha por Escape, com retorno do foco. WhatsApp permanece na primeira tela. Cinco campos, revisão, edição e estado de consentimento foram testados. O erro direciona para o campo inválido e as ações de cópia/download dão feedback junto aos controles. |

O pacote contém pares Chromium antes/depois para seis rotas em **320, 375, 390, 768, 1024 e 1440 px**. Compare `projetos-320.png`, `servicos-1440.png`, `rodape-320.png` e `feedback-copia-320.png`. A captura `sobre-prova-320.png` mostra o novo link em contexto no candidato. A inspeção conferiu hierarquia, alinhamento e quebra de linhas, além do estado focalizado do resumo. O arquivo `visual-comparison.json` indica diferenças de pixels e enquadramentos comparáveis. O rodapé utilitário foi capturado como recorte para excluir os dados de contato.

## Validação técnica

- Vite 8.3.5, com prefixo de GitHub Pages. Os 17 testes Node passaram antes e depois. O runner versionado passou com as verificações adicionadas.
- Chromium 153.0.8010.0 e WebKit WPE 26.5 em Linux, por HTTP local. 36 combinações por rodada, sem overflow de documento, erro de console ou falha de recursos nos resultados. WebKit em Linux complementa a validação de Safari.
- Axe em Chromium nas seis rotas a 320 e 1440 px, mais erro de nome e falha de clipboard a 320 px. Zero grupos de violações em ambos os builds nessa amostra. A comparação de nomes acessíveis e visibilidade forneceu evidência independente do axe.
- Automated Visual Review V9.1.1 em Home, Contato e case, seis larguras × duas preferências. Antes e depois, cada rota registrou 78 PASS, 0 FAIL, 0 BLOCKED e 12 NOT TESTED. Os 12 registros são cenários de modal sem caso aplicável. O teste de teclado do menu e do briefing é independente.
- O aceite estrutural e a validação da matriz retornaram CONDITIONAL, sem erro estrutural.

### Laboratório de performance

Chromium, 390 × 844, CPU limitada a 4×, HTTP local sem limitação de rede. Três contextos frios por rota e versão. As medianas são do intervalo amostrado pelo PerformanceObserver.

| Rota | LCP antes → depois | FCP antes → depois | CLS antes → depois |
| --- | ---: | ---: | ---: |
| Home | 360 → 308 ms | 360 → 308 ms | 0,00216 → 0 |
| Contato | 232 → 228 ms | 232 → 228 ms | 0,14550 → 0 |
| NØVA STREET | 252 → 220 ms | 252 → 220 ms | 0,00007 → 0 |

O JS passou de 96,01 para 96,35 kB gzip e o CSS de 7,49 para 7,56 kB gzip. O preload usa as mesmas duas fontes, sem novo arquivo ou dependência. Os valores de laboratório demonstram o deslocamento reproduzido e não medem desempenho em rede móvel real, INP de campo ou TBT do Lighthouse.

## Cobertura dos 135 requisitos

| Revisão | PASS | PARTIAL | FAIL | NOT APPLICABLE | BLOCKED | NOT TESTED isolados |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 2.1 | 73 | 32 | 0 | 29 | 1 | 0 |
| 2.2 | 73 | 32 | 0 | 29 | 1 | 0 |

A [matriz atualizada](coverage-freelancer-2.2.csv) mantém os IDs e os critérios oficiais. Evidências novas fortalecem resultados existentes e cobrem casos específicos, sem alterar a classificação quando persiste uma lacuna. A origem diferencia releitura da 2.2 de evidência herdada. PARTIAL e BLOCKED são exportados como `not_tested` apenas para compatibilidade com o validador.

## Pendências para revisão

- Aceite visual do proprietário. Confirme Serviços, os filtros e o rodapé a 320 px, e o aviso de cópia junto às ações do resumo.
- Safari em iPhone físico, leitor de tela e validação da entrega em Supabase gerenciado continuam pendentes. O [roteiro manual da 2.1](qa-freelancer-2.1.md#roteiro-para-aceite-manual-assistivo) continua válido. Acrescente o teste de erro “Informe seu nome” e o anúncio do status após negar a cópia. Nenhum envio real foi feito nesta rodada.
- Métricas de campo, imagem Open Graph e reorganização de rotas operacionais dependem de verificação ou decisão posterior. Não houve alteração no repositório da NØVA STREET ou na integração comercial.

## Reprodução

```sh
npm test
GITHUB_PAGES=true npm run build
node scripts/audit-portfolio.cjs dist /tmp/freelancer-2.2
```

O runner usa Playwright e Chromium. `PLAYWRIGHT_MODULE`, `CHROMIUM_PATH` e `AXE_MODULE` permitem apontar para instalações locais. O resultado foi preparado para o PR #1 da branch existente, sem merge automático.
