import test from "node:test";
import assert from "node:assert/strict";
import { code, submission, owner, text } from "./validation.js";
test("a caixa rejeita código incompleto, nome vazio e mensagens enormes", () => {
  assert.throws(() => code("abc"));
  assert.throws(() => code("G".repeat(64)));
  assert.throws(() => submission({ name: " ", service: "site", goal: "site" }));
  assert.throws(() => text("x".repeat(5001), 5000, "mensagem"));
  assert.equal(code("a".repeat(64)), "a".repeat(64));
});
test("briefing preserva acentos e trata campos opcionais sem conteúdo", () => {
  const s = submission({
    name: " Ana ",
    service: "Catálogo",
    goal: " Café & pão ",
  });
  assert.equal(s.name, "Ana");
  assert.match(s.body, /Café & pão/);
  assert.match(s.body, /A combinar/);
});
test("somente o proprietário com email confirmado pode administrar", () => {
  assert.equal(
    owner({
      id: "1",
      email: "cliente@example.com",
      email_confirmed_at: "2026",
    }),
    false,
  );
  assert.equal(owner({ id: "1", email: "douglasxxxbarbosa@gmail.com" }), false);
  assert.equal(
    owner({
      id: "1",
      email: "outro@example.com",
      email_confirmed_at: "2026",
      user_metadata: { email: "douglasxxxbarbosa@gmail.com" },
    }),
    false,
  );
  assert.equal(
    owner({
      id: "1",
      email: "douglasxxxbarbosa@gmail.com",
      email_confirmed_at: "2026",
    }),
    true,
  );
});
