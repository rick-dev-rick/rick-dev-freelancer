import { createHandler } from "./handler.js";
function keyFrom(name: string, fallback: string) {
  try {
    return (
      JSON.parse(Deno.env.get(name) || "{}").default ||
      Deno.env.get(fallback) ||
      ""
    );
  } catch {
    return Deno.env.get(fallback) || "";
  }
}
Deno.serve(
  createHandler({
    url: Deno.env.get("SUPABASE_URL") || "",
    secret: keyFrom("SUPABASE_SECRET_KEYS", "SUPABASE_SERVICE_ROLE_KEY"),
    publishable: keyFrom("SUPABASE_PUBLISHABLE_KEYS", "SUPABASE_ANON_KEY"),
  }),
);
