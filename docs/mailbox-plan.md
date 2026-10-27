# Caixa de mensagens
- Backend separado: Supabase xqtqobtmxuekrdrlpnxr.
- O visitante escolhe Site, WhatsApp ou email após preparar briefing.
- Site: visitante envia briefing, recebe código privado e acompanha/responde pela página Mensagens, sem conta e sem redirecionamento obrigatório.
- Código aleatório de 256 bits, somente hash no banco; código em sessionStorage quando disponível, sem dados pessoais ou segredos em URLs.
- Painel do desenvolvedor: autenticação Supabase com email confirmado do proprietário; autenticação verificada no backend em toda operação administrativa.
- Tabelas com RLS e sem acesso anon/authenticated; Edge Function valida entradas, acesso, origem e limites antes de operações via credencial de servidor.
- Testes: validação, isolamento, autenticação, falhas de rede, persistência real, resposta e leitura pela chave correta; revisão independente antes de publicar.
- Sem notificações por email nesta versão: cliente volta com código para atualizar respostas. Proprietário precisa confirmar conta antes de usar painel.

## Validação executada
- 14 testes unitários: validação, dono confirmado, isolamento, erros, identificadores aleatórios e encaminhamento idempotente.
- Integração com banco real: criar, ler, responder, recusar código errado, recusar acesso administrativo anônimo e leitura direta de tabelas.
- Reenvio com mesmo requestId: não duplicou mensagem.
- Navegador: três canais, envio pelo site, resposta do servidor, retorno do cliente e recuperação ao recarregar.
- Mobile: conversa a 390px (375px úteis), sem overflow, campo de resposta 16px.
- Revisão independente e correções de recuperação pendente, edição durante envio, reenvio idempotente e reautenticação sem perder rascunho.
- As únicas observações do advisor foram RLS sem políticas, intencional para tabelas bloqueadas a anon/authenticated; grants negativos conferidos por SQL.
- Dados sintéticos removidos. O login real do proprietário aguarda criação da conta por ele, sem senha definida pelo agente.

## Status de conclusão
17 testes passaram. Verificação no banco real em transação temporária conferiu: nova conversa aberta, finalização idempotente, histórico intacto, reabertura manual, nova mensagem reabrindo, repetição de mensagem antiga sem reabrir, e negação de EXECUTE a anon/authenticated. Dado temporário removido na mesma transação. Revisão independente sem bloqueios. Advisor: RLS sem políticas intencional; aviso de proteção contra senhas vazadas desativada na configuração de Auth, fora do escopo deste recurso.
