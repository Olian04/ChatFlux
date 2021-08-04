export type Serializeable =
  | string
  | number
  | boolean
  | Serializeable[]
  | { [k in string | number]: Serializeable };
