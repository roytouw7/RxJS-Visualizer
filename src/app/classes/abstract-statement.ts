export abstract class AbstractStatement {
  protected readonly regexp: RegExp;

  constructor(regex: RegExp) {
    this.regexp = regex;
  }

  test(segment: string): boolean {
    const match = this.regexp.test(segment);
    this.regexp.lastIndex = 0;
    return match;
  }

  protected getAllMatches(segment: string): RegExpMatchArray[] {
    return Array.from(segment.matchAll(this.regexp));
  }
}
