const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** Formata um valor em centavos (inteiro) como moeda BRL. */
export function formatCents(cents: number): string {
  if (!Number.isSafeInteger(cents)) {
    throw new TypeError("O valor em centavos deve ser um número inteiro.");
  }
  return brl.format(cents / 100);
}
