import test from "node:test";
import assert from "node:assert/strict";
import { newAccessCode, newRequestId } from "./mailbox.js";
test("códigos de acesso e identificadores usam aleatoriedade e funcionam sem randomUUID do navegador", () => {
  const original = crypto.randomUUID;
  Object.defineProperty(crypto, "randomUUID", {
    configurable: true,
    value: undefined,
  });
  try {
    const codes = new Set(Array.from({ length: 50 }, newAccessCode));
    assert.equal(codes.size, 50);
    assert.ok([...codes].every((code) => /^[a-f0-9]{64}$/.test(code)));
    const ids = new Set(Array.from({ length: 50 }, newRequestId));
    assert.equal(ids.size, 50);
    assert.ok(
      [...ids].every((id) =>
        /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(
          id,
        ),
      ),
    );
  } finally {
    Object.defineProperty(crypto, "randomUUID", {
      configurable: true,
      value: original,
    });
  }
});
