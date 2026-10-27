import test from "node:test";
import assert from "node:assert/strict";
import { createBrief, validateBrief } from "./brief.js";
test("brief exige nome, objetivo e serviço sem aceitar espaços vazios", () => {
  assert.equal(
    validateBrief({ name: " ", goal: "site", service: "Landing page" }),
    false,
  );
  assert.equal(
    validateBrief({ name: "Ana", goal: " ", service: "Landing page" }),
    false,
  );
  assert.equal(
    validateBrief({ name: "Ana", goal: "site", service: "" }),
    false,
  );
  assert.equal(
    validateBrief({ name: "Ana", goal: "site", service: "Landing page" }),
    true,
  );
});
test("brief preserva o objetivo e oferece contexto quando o negócio e prazo não foram definidos", () => {
  const brief = createBrief({
    name: " Ana ",
    business: " ",
    service: "Site institucional",
    goal: " Apresentar meus serviços ",
    deadline: "",
  });
  assert.ok(brief.includes("Nome: Ana"));
  assert.ok(brief.includes("Negócio: Ainda não definido"));
  assert.ok(brief.includes("Objetivo: Apresentar meus serviços"));
  assert.ok(brief.includes("Prazo desejado: A combinar"));
});
