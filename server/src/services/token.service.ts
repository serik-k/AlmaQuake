// In production: replace with MongoDB or Redis
const tokens = new Set<string>();

export const tokenService = {
  add:    (t: string) => tokens.add(t),
  remove: (t: string) => tokens.delete(t),
  all:    ()          => [...tokens],
  count:  ()          => tokens.size,
};
