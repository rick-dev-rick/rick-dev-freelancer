import test from "node:test";
import assert from "node:assert/strict";
import { whatsappUrl, emailUrl } from "./contact.js";
test("WhatsApp usa DDI brasileiro e preserva acentos e quebras do briefing", () => {
  const message = "Olá!\nObjetivo: catálogo & serviços + orçamento";
  const url = new URL(whatsappUrl(message));
  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname, "/5561985195534");
  assert.equal(url.searchParams.get("text"), message);
});
test("email direciona ao endereço autorizado com o resumo completo", () => {
  const message = "Negócio: café & pão\nPrazo: a combinar";
  const url = new URL(emailUrl(message));
  assert.equal(url.pathname, "douglasxxxbarbosa@gmail.com");
  assert.equal(url.searchParams.get("body"), message);
  assert.equal(
    url.searchParams.get("subject"),
    "Orçamento de projeto — rick_dev",
  );
});
