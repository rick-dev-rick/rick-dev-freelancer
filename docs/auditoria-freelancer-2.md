# Auditoria e evolução do rick_dev Freelancer 2.0

Data de verificação: 17/11/2026. Base: `75b3e19336b47e6a32a1031cb7691f5d14f2504a`. O build foi servido por HTTP local em Chromium 153.0.8010.0. A branch proposta não executa o workflow de publicação, disparado por push em main ou acionamento manual.

## Referência de qualidade e escopo

RICK_DEV Design Excellence V9.1.1 Modal Focus, ZIP SHA-256 `b600c592f627e8cc1c76a42ca3ab91854328204a08d09a71fb90b4ae6840643e`. O frontmatter ainda declara 9.1.0. O pacote, a seção de foco e os arquivos correspondentes identificam a revisão 9.1.1. O ZIP passou na verificação CRC e os 44 testes da Skill passaram. O catálogo contém 11 setores e 135 IDs.

Foram usados roteamento de auditoria, preflight, exploração criativa, referências de motion, biblioteca como referência de implementação, revisor visual, integridade de evidências e aceite estrutural. O showcase e os controles de ajuste da Skill não foram revalidados como parte do produto. Não há manifesto de projeto ou extensão aprovado no Freelancer. O preflight marcou operações que dependem desses arquivos como bloqueadas. As melhorias usam o código e a identidade aprovada no briefing, sem carregar presets ou exemplos de outro projeto. O case usa a captura efetiva de um build do repositório NØVA STREET e não altera esse repositório.

## A. Auditoria inicial

| Página / componente | Comportamento e causa | Requisitos | Impacto e prioridade | Evidência e solução |
| --- | --- | --- | --- | --- |
| Contato → caixa de mensagens | Voltar da revisão perdeu nome, negócio, serviço, objetivo e prazo. Contato inicia seu estado local vazio a cada montagem. | DS-06-07, DS-10-09 | Retrabalho no caminho de orçamento, P1 | `before/audit.json` → `backPreserved=false`. Preservar o rascunho no retorno e oferecer edição explícita. |
| Cinco páginas / contraste e cabeçalho | Textos secundários claros demais e nome acessível do logo divergia do texto. Projetos também saltava H1→H3. | DS-01-05, DS-02-05, DS-08-07, DS-08-08 | Leitura e navegação assistiva, P1 | Axe registrou 10 grupos de contraste, 10 de nome acessível e 2 de hierarquia em 10 combinações. Reusar papel de cor secundária e semântica nativa. |
| Contato / WhatsApp | Em 320 × 844, o botão começa em y=824 e termina em y=878. A ação aparecia depois da abertura e das explicações laterais. | DS-04-01, DS-04-03, DS-08-03 | Aumenta esforço para prosseguir no celular, P1 | `before/contato-320.png` e medidas do JSON. Mover canais diretos para a introdução. |
| Contato / resumo | Ao preparar, o foco fica no botão e o título começa em y=893, fora da área visível de 844 px. Aviso customizado genérico sem vínculo ao campo. | DS-05-10, DS-06-03, DS-06-05, DS-08-12 | Usuário pode perder a continuação, P1 | `before/resumo-390.png` e `flows.summary`. Focalizar o título e associar cada erro ao campo. |
| Home → Projetos / NØVA STREET | A chamada do case abre a lista geral. O card existente mostra recursos e uma ilustração CSS, com poucos detalhes sobre decisões de interface. | DS-04-08, DS-05-06, DS-10-11 | Valor do trabalho pouco demonstrado, P1 | `before/case-1440.png` e URL capturada. Apresentar o case em rota própria com captura real e links ao demo e ao código. |
| Home → Serviços / cartões | Todos os cartões apontam para o topo da mesma rota, embora anunciem soluções específicas. | DS-04-06, DS-06-07 | Obriga a localizar de novo o serviço, P2 | `src/pages/Home.jsx` na base e navegação verificada. Apontar para a seção com foco no título. |
| Home / botão e fontes | A transição era cancelada em movimento reduzido, mas o deslocamento de hover se aplicava instantaneamente. Fonte externa falhou na execução sem cache do revisor. | DS-07-03, DS-07-11, DS-10-15 | Movimento residual e dependência de rede externa, P2 | CSS da base e `skill-baseline/errors.log`. Suprimir translação com reduce e servir os WOFF2 no build. |
| Sobre / composição e mensagem | Texto e estrutura consistentes com a marca, com contraste secundário insuficiente em conteúdo decorativo. Os princípios expostos têm pouca demonstração visual. | DS-04-05, DS-04-08, DS-08-08 | Legibilidade e evidência comercial, P2/P3 | `before/sobre-320.png` + axe. Corrigir o contraste comum e usar o case próprio como prova de execução. |

As seis larguras nas cinco páginas da base não apresentaram overflow de documento. O preenchimento do serviço por link já funcionava. A revisão do pedido já exigia consentimento antes do envio.

## B. Implementação

- **Contato e mensagens.** `Contact.jsx`, `Messages.jsx`, `Layout.jsx` e `brief.js` preservam os dados e o resumo no retorno da revisão, associam erros aos campos e deslocam o foco até o título gerado. A edição explícita reaproveita o mesmo formulário e não envia o pedido. WhatsApp e e-mail direto entram na abertura do Contato. `pages.css`, `responsive-mobile.css` e `mailbox.css` registram a nova disposição e os estados.
- **Legibilidade e performance.** `base.css`, `home.css`, `pages.css` e `ProjectCard.jsx` reusam uma cor de texto secundário testada, corrigem a hierarquia de títulos e preservam as famílias tipográficas. Fontes WOFF2 latinas e licenças em `src/assets/fonts/`. Caracteres fora desse subconjunto recorrem à pilha de fallback. Sem novas dependências de produção.
- **Navegação e case.** `App.jsx`, `Layout.jsx`, `Home.jsx`, `Services.jsx`, `ProjectCard.jsx` e `data/projects.js` ligam o case a Home e Projetos e dão aos cartões de serviços destinos específicos. `NovaCase.jsx`, `nova-case.css`, `styles.css` e o WebP em `src/assets/cases/` compõem a rota.
- **Regressão.** `scripts/audit-portfolio.cjs` percorre páginas por HTTP, mede overflow e dobra, valida rascunho, erros, navegação, consentimento e comportamento de motion, grava capturas e permite sequência com axe.

### Direção criativa e motion

Foram comparadas apresentação editorial com captura dominante, roteiro longo da jornada e card expansível na lista. A rota editorial foi escolhida pela leitura rápida, facilidade de compartilhar e capacidade de explicar decisões verificáveis sem aumentar a complexidade da lista de projetos. A captura WebP vem do build GitHub Pages do commit NØVA STREET `fe560222451383808b21c6a80e21f5dd1ae665ca` em Chromium a 1200 × 760, com a fotografia original utilizada pelo próprio projeto. [Código da NØVA STREET](https://github.com/rick-dev-rick/nova-street/tree/fe560222451383808b21c6a80e21f5dd1ae665ca)

A entrada do case anima somente a captura em 240 ms, com opacidade e translação de 8 px. As dimensões da imagem estão declaradas e links ficam operáveis desde o início. A preferência reduzida desativa a entrada e neutraliza a translação no hover. O projeto não ganhou dependência de animação nem observador de scroll.

## C. Evidências visuais

O pacote de evidências contém pares `before/` e `after/` para Home, Serviços, Projetos, Sobre e Contato em 320 × 844 e 1440 × 900, mais a jornada do case e o resumo em 390 × 844. `case-*.png` representa o mesmo clique nas duas revisões, antigo destino da lista e novo destino do case. As fontes equivalentes da base foram fornecidas por cache local no runner comparativo, mantendo as páginas e seus scripts servidos por HTTP. O revisor independente da Skill não usou cache e preservou os erros de fonte da base.

## D. Auditoria final e evolução

| Medida | V9.0 anterior | Base nova | Resultado |
| --- | --- | --- | --- |
| Retorno do briefing | Perda identificada | Perda reproduzida | Cinco campos e o resumo retornam. Edição e consentimento verificados. |
| WhatsApp em 320 × 844 | Primeiro trecho visível | Botão termina a 878 px | Botão termina a 456 px. |
| Resumo em 390 × 844 | Fora da dobra, foco no botão | Título em 893 px, sem foco | Título em 418 px, com foco. |
| CTA NØVA | Lista geral | `#/projetos` | `#/projetos/nova-street`, com captura e demo. |
| Axe em mesmas cinco rotas × 2 larguras | Amostra de metodologia distinta | 22 violações agrupadas, 137 ocorrências de elementos | Zero violações na amostra equivalente de 320 e 1440. |
| Revisor V9.1.1 na Home, 6 larguras × 2 preferências | Runner e matriz diferentes | 54 PASS, 24 FAIL, 12 NOT TESTED | 78 PASS, zero FAIL e 12 NOT TESTED. |
| Testes Node do projeto | 17 | 17 | 17, mais regressão funcional em Chromium por HTTP. |
| Performance observável | Bundle anterior | JS gzip 94,87 kB, CSS gzip 6,68 kB | JS gzip 96,01 kB, CSS gzip 7,17 kB. Fontes locais somam 61,46 kB, captura do case 47,8 kB. |

O resultado de axe é limitado às regras e aos cenários executados. Não houve leitura com leitor de tela, validação em aparelho físico, envio real ao Supabase, medição de Core Web Vitals ou teste quantitativo de conversão. O revisor marcou os ensaios de modal como não executados porque o Freelancer não tem modal nesse fluxo. Os testes da V9.1.1 não se confundem com os testes do produto.

| Classificação | V9.0 anterior | Base nova | Após correções |
| --- | ---: | ---: | ---: |
| Aprovados | 23 | 17 | 43 |
| Parciais | 71 | 28 | 12 |
| Reprovados | 12 | 11 | 2 |
| Não aplicáveis | 27 | 27 | 27 |
| Não verificados | 2 | 52 | 51 |

O recorte de evidência da segunda auditoria foi mais conservador. Requisitos sem prova específica foram registrados como não verificados. A tabela não compara percentuais com a avaliação anterior. Os 135 IDs são apresentados nos dois JSONs de cobertura. O validador atual não tem estado parcial. Esse resultado permanece em `observed_status` e é exportado como `not_tested` apenas para o validador. Ambos os arquivos passaram na checagem estrutural. O status normativo segue FAIL por dois requisitos persistentes, escala de espaçamento formal e catálogo de componentes. Não foi encontrada regressão crítica no escopo executado.

**Aceite técnico do recorte:** cenários funcionais e revisão HTTP executados. **Aceite criativo:** condicional à revisão do proprietário. Recomendações posteriores: formalizar a escala de espaçamento e o catálogo de componentes, validar leitores de tela e dispositivos físicos. A arquitetura e os canais de produção seguem com o mesmo contrato.

## Reprodução

```sh
npm ci
npm test
GITHUB_PAGES=true npm run build
node scripts/audit-portfolio.cjs dist /tmp/freelancer-evidence
```

O último comando requer Playwright e Chromium disponíveis no ambiente. Pode receber `PLAYWRIGHT_MODULE`, `CHROMIUM_PATH` e `AXE_MODULE` com os caminhos das ferramentas de QA. A opção `--baseline` registra o comportamento anterior sem exigir as novas correções. Use `FONT_FIXTURES` com a folha Google Fonts e os WOFF2 sob `fonts/` para reproduzir a comparação com cache no build anterior. Não é necessário adicionar essas dependências ao aplicativo.
