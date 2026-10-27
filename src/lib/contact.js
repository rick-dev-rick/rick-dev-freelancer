export const contact = {
  whatsapp: "5561985195534",
  phoneLabel: "(61) 98519-5534",
  email: "douglasxxxbarbosa@gmail.com",
};
export function whatsappUrl(
  message = "Olá, rick_dev! Quero conversar sobre um projeto.",
) {
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
export function emailUrl(message = "") {
  return `mailto:${contact.email}?subject=${encodeURIComponent("Orçamento de projeto — rick_dev")}&body=${encodeURIComponent(message)}`;
}
