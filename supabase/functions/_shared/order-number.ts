export function generateOrderNumber(): string {
  const digits = Math.floor(100000 + Math.random() * 900000);
  return `SMT-${digits}`;
}
