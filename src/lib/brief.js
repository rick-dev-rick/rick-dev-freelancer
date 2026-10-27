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
export function validateBrief(values) {
  return Boolean(values.name?.trim() && values.goal?.trim() && values.service);
}
