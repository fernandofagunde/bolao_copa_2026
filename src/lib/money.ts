export const BET_AMOUNT_CENTS = 10000;

export function formatBRLFromCents(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100);
}
