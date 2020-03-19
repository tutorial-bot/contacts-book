export function value() {
  return Math.random();
}

export function id() {
  return value().toString(16).slice(2);
}
