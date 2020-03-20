export default function areSetsEqual(a, b) {
  if (a.size !== b.size) {
    return false;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const value of a) {
    if (!b.has(value)) {
      return false;
    }
  }

  return true;
}
