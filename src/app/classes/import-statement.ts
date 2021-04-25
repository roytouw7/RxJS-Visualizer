import { IdentifierObject, ImportObject } from '../contracts/import-expression';
import { AbstractStatement } from './abstract-statement';

export class ImportStatement extends AbstractStatement {
  //  prettier-ignore
  static readonly regex: RegExp = new RegExp(/import\s+{((\s*[a-z]+\s*,\s*)|(\s*[a-z]+\s+as\s+[a-z]+\s*\,))*((\s*[a-z]+\s*)|(\s*[a-z]+\s+as\s+[a-z]+\s*))}\s+from\s+(\'|\"|\\\")([a-z]+\/?)*([a-z]+)(\'|\"|\\\");?/, 'gi');

  constructor() {
    super(ImportStatement.regex);
  }

  /** Extract all import objects from code segment. */
  extractAllImportObjects(codeSegment: string): ImportObject[] {
    const matches = this.getAllMatches(codeSegment);
    return this.mapMatchesToImportObjects(matches);
  }

  private mapMatchesToImportObjects(matches: RegExpMatchArray[]): ImportObject[] {
    const matchStringIndex = 0;
    return Array.from(matches, (match) => this.toImportObject(match[matchStringIndex]));
  }

  /** Transform import segment to ImportObject */
  private toImportObject(importSegment: string): ImportObject {
    const identifiers = this.extractImportIdentifiers(importSegment);
    const library = this.extractLibrary(importSegment);

    return { identifiers, library };
  }

  /** Extract the library from given import segment. */
  private extractLibrary(importSegment: string): string {
    const libraryRegex = /from\s+(\'|\"|\\\")(([a-z]+\/)*[a-z]+)(\'|\"|\\\")/i;
    const libraryGroupIndex = 2;
    const libraryMatches = importSegment.match(libraryRegex);

    if (!libraryMatches) {
      throw new Error('No valid import statement, no library found!');
    }

    return libraryMatches[libraryGroupIndex];
  }

  /** Extract IdentifierObjects from import segment.  */
  private extractImportIdentifiers(importSegment: string): IdentifierObject[] {
    const insideBracesRegex = /\{\s*(.*)\s*\}/;
    const identifierGroupIndex = 1;
    const identifierMatches = importSegment.match(insideBracesRegex);

    if (!identifierMatches) {
      throw new Error('No valid import statement, no valid identifier group found!');
    }

    const identifiers = identifierMatches[identifierGroupIndex].split(',');
    const trimmedIdentifiers = identifiers.map((identifier) => identifier.trim());

    return trimmedIdentifiers.map(this.toIdentifierObject);
  }

  /** Seperate identifier and possible alias into IdentifierObject. */
  private toIdentifierObject(identifier: string): IdentifierObject {
    const aliasRegex = /[a-z]+\sas\s[a-z]+/i;

    if (!aliasRegex.test(identifier)) {
      return { identifier };
    } else {
      const [id, _, alias] = identifier.split(' ');
      return { identifier: id, alias };
    }
  }
}
