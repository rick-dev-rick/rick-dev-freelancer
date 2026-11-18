# Design System do rick_dev Freelancer

## Fundamentos e escala

A identidade é clara, com azul de ação `--blue`, texto secundário `--muted`, linha `--line` e superfície `--paper`, definidos em [base.css](../src/styles/base.css). DM Sans conduz a leitura. Nas seis rotas públicas, Georgia e o fallback serifado do sistema compõem os títulos editoriais. Manrope identifica a marca e os títulos funcionais. A folha [caderno.css](../src/styles/caderno.css) define papel quente, tinta e filetes. O subgrupo latino é servido localmente com fallback de sistema. O contraste de textos e estados deve ser conferido no fundo efetivamente renderizado, inclusive durante animações.

[spacing.css](../src/styles/spacing.css) centraliza os valores de espaçamento da aplicação. Os nomes numéricos representam pixels. O ritmo principal usa múltiplos de 4, com passos intermediários para dimensões existentes. A adoção preserva os valores computados da versão 2.0. Os valores de composição editorial específicos de uma cena permanecem no seu arquivo até haver reutilização clara.

| Família | Valores | Aplicação |
| --- | --- | --- |
| Compacta | 4, 6, 8, 10, 12 px | Ícones, rótulos, navegação, ações próximas |
| Componente | 14, 16, 18, 20, 22, 24, 28, 30, 32 px | Campos, ações, cartões, listas, alinhamento |
| Composição | 40, 44, 48, 58, 64, 90 px | Recuos e distâncias entre blocos editoriais |

| Papel | Token | Uso |
| --- | --- | --- |
| Botão primário | `--space-action-inline`, `--space-action-gap` | Recuo horizontal e distância entre texto e ícone de `.button` |
| Formulário | `--space-field-inset`, `--space-field-stack` | Padding interno de campos e distância ao campo seguinte |
| Escolha de canal | `--space-channel-gap` | Distância entre opções do resumo |
| Seção editorial | `--space-section-block` | Padding vertical de `.section`. 90 px acima de 760 px e 58 px até 760 px |

Desktop, tablet e mobile partilham os tokens. As folhas responsivas continuam definindo quais elementos mudam de medida ou coluna. Dimensões de alvos de toque, raio, contorno de foco e posições de camadas são contratos separados. Aplique o token semântico existente quando a relação for a mesma. Para uma exceção de arte local, registre o motivo em sua revisão antes de promover a medida à escala.

## Catálogo de componentes em uso

| Componente | Entrada e variantes | Estados e tokens | Responsividade e acessibilidade |
| --- | --- | --- | --- |
| Ações CSS `.button`, `.button.light`, `.outline-button`, `.text-link`, `.text-button` | Use `button` para ação local, React Router `Link` para rota e `a` para destino externo. `.light` para contraste na faixa azul | Cores de ação e linha, `--space-action-inline` e `--space-action-gap` para primária. Foco, hover e disabled quando a ação é indisponível | Contrato visual de foco comum. O botão de ação mobile recebe mínimo de 44 px por CSS. A preferência reduzida evita a translação do hover |
| [Layout](../src/components/Layout.jsx) | Shell do React Router, cabeçalho, navegação, área principal e rodapé | NavLink marca a rota ativa. Menu mobile expõe expansão. Usa gaps e recuos de navegação | Em desktop mostra links e CTA. Em mobile o menu é uma divulgação operada por um botão e fecha com Escape, devolvendo foco ao controle. Navegação por seção foca o título correspondente. Links utilitários do rodapé têm 44 px de altura no mobile |
| [ProjectCard](../src/components/ProjectCard.jsx) | `project` com id, nome, tipo, descrição, tags e features. URL de demonstração e case condicionais | Superfície e densidade de catálogo. Ordem de leitura começa pelo nome | A grade vira uma coluna. Cada destino tem seu próprio link. O card inteiro não deve ser envolvido por outro link |
| [ProjectVisual](../src/components/ProjectVisual.jsx) | `project` seleciona nova, os ou rafaela. `hero` habilita a composição da Home | Miniatura CSS, proporção e moldura controladas por estilo | Representação decorativa com `aria-hidden`. Nome, descrição e links são externos à miniatura. Para imagem informativa real, use `figure`, `img` e alternativa textual |
| [CTA](../src/components/CTA.jsx) | Faixa compartilhada sem props. A ação leva ao Contato | `--blue` na superfície, botão `.light` e gap da composição | Empilha no mobile. Título antes do link, ícone decorativo |
| [Process](../src/components/Process.jsx) | Seção com etapas descritivas sem props | Hierarquia de título e descrição, espaçamento de seção | Colunas se reorganizam sem depender de interação. Descrição concreta de cada etapa no texto |
| [Icon](../src/components/Icon.jsx) | `name` para arrow, horizontal, download e sparkle. `className` opcional | SVG em `currentColor`, dimensionado pelo texto | Sempre decorativo e fora do foco. Botão só de ícone precisa incluir nome acessível no próprio acionador |
| Campos e resumo do [Contato](../src/pages/Contact.jsx) | Inputs, select e textarea nativos. Campos obrigatórios e opcionais | `--space-field-inset` e `--space-field-stack`. Rótulo, invalid e mensagem por campo. Status de preparação e ações de canal | Grade de campos vira uma coluna. Erro é associado por `aria-describedby` e não faz parte do rótulo. O título recebe foco ao gerar o resumo. Copiar e baixar usam uma região de status junto às ações |
| Revisão do [pedido](../src/pages/Messages.jsx) | Revisar, consentir, enviar ou editar o briefing | `--space-channel-gap` e espaçamento dos painéis. Consentimento, ocupação, erro e confirmação | CTA e Editar briefing podem quebrar linha. Envio exige consentimento. Rascunho persiste até revisar ou editar |
| [AccessCode](../src/components/AccessCode.jsx) | `code` entregue pela caixa | Visualização, cópia, fallback e aviso de status | Código com rótulo e controle de cópia acionável. Mantenha os avisos de segurança da conversa |
| [Conversation](../src/components/Conversation.jsx) | `data`, `code`, `admin`, `onUpdate`. Estados de leitura, resposta e finalização | Painel, mensagens e região viva. Controles desabilitados em espera | Área de resposta não deve bloquear navegação. Mantenha a identificação de autor e horário |
| [AdminLogin](../src/components/AdminLogin.jsx) | `onLogin` informado pelo consumidor | Enviando, erro e status | Formulário restrito com rótulo, input de senha e confirmação. Sem exemplo com credenciais reais |

### Exemplos no código

```jsx
<Link className="button light" to="/contato">
  Conversar sobre meu projeto <Icon />
</Link>

<button className="outline-button" type="button" disabled={busy} onClick={refresh}>
  Atualizar respostas
</button>
```

Use um link quando o resultado é navegação e um botão quando o resultado é ação. Preserve o rótulo visível dentro do nome acessível e deixe o ícone decorativo. Em cartões com vários destinos, mantenha links independentes. Uma captura informativa do case conserva texto alternativo e legenda com contraste próprio.

## Caderno de Projeto

Na Home, cada serviço usa um sumário nativo e mantém o link para sua seção. A galeria alterna as capturas de desktop e celular com botões de estado anunciado e legenda. O quadro reserva espaço durante a troca. A abertura anima apenas a fotografia e a assinatura por até 950 ms. No celular a distância cai à metade e a assinatura sai da composição. Movimento reduzido exibe o estado final.

## Manutenção

- Reaproveite a variante existente quando propósito e requisito de teclado coincidirem. Crie componente novo quando houver responsabilidade isolada ou repetição real que justifique um contrato compartilhado.
- Componentes React em PascalCase, classes CSS no padrão kebab-case, tokens globais com prefixo de família e aliases semânticos quando a relação de uso for estável.
- Quando mudar uma prop, estado ou token, atualize a entrada do catálogo e as regras de uso no mesmo PR. Documente incompatibilidades e caminho de substituição antes de remover uma variante.
- Na revisão, verifique o fluxo por teclado, movimento reduzido, contraste, breakpoint e a captura correspondente. Conserve a linha de base anterior para revisão humana do diff.
