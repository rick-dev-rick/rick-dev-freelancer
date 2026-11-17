export function createBrief(values) {
  return [
    "Olá, rick_dev! Quero conversar sobre um projeto.",
    `Nome: ${values.name.trim()}`,
    `Negócio: ${values.business.trim() || "Ainda não definido"}`,
    `Serviço: ${values.service}`,
    `Objetivo: ${values.goal.trim()}`,
    `Prazo desejado: ${values.deadline || "A combinar"}`,
  ].join("\n");
}
export function briefErrors(values) {
  const errors = {};
  if (!values.name?.trim()) errors.name = "Informe seu nome.";
  if (!values.service) errors.service = "Escolha um serviço ou a opção de orientação.";
  if (!values.goal?.trim()) errors.goal = "Descreva o objetivo do seu projeto.";
  return errors;
}

export function validateBrief(values) {
  return Object.keys(briefErrors(values)).length === 0;
}
