export class InputError extends Error {}
export function text(value, max, label, required = true) {
  if (
    typeof value !== "string" ||
    value.trim().length > max ||
    (required && !value.trim())
  )
    throw new InputError(`Confira o campo ${label}.`);
  return value.trim();
}
export function code(value) {
  if (typeof value !== "string" || !/^[a-f0-9]{64}$/.test(value.trim()))
    throw new InputError(
      "Informe o código privado completo, com 64 caracteres.",
    );
  return value.trim();
}
export function submission(value) {
  const result = {
    name: text(value.name, 100, "nome"),
    business: text(value.business || "", 150, "negócio", false),
    service: text(value.service, 100, "serviço"),
    goal: text(value.goal, 3000, "objetivo"),
    deadline: text(value.deadline || "", 150, "prazo", false),
  };
  return {
    ...result,
    body: `Pedido de projeto\nNome: ${result.name}\nNegócio: ${result.business || "Ainda não definido"}\nServiço: ${result.service}\nObjetivo: ${result.goal}\nPrazo desejado: ${result.deadline || "A combinar"}`,
  };
}
export function owner(user) {
  return Boolean(
    user?.id &&
    user?.email?.toLowerCase() === "douglasxxxbarbosa@gmail.com" &&
    user.email_confirmed_at,
  );
}
