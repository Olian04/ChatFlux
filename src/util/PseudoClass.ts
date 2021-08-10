export const PseudoClass = <Args extends any[], Class>(constructor: (...args: Args) => Class) =>
  constructor as any as {
    new (...args: Args): Class;
  };
