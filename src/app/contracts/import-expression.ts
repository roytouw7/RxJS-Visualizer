export interface ImportObject {
  identifiers: IdentifierObject[];
  library: string;
}

export interface IdentifierObject {
  identifier: string;
  alias?: string;
}
