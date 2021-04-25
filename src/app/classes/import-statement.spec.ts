import { ImportObject } from '../contracts/import-expression';
import { ImportStatement } from './import-statement';
import { TestHelper } from './test-helper';

describe('import-statement', () => {
  let importStatement: ImportStatement;
  const helper = new TestHelper();

  beforeEach(() => {
    importStatement = new ImportStatement();
  });

  it('should extract all import statements from a sourcefile in the format of ImportObjects', (done) => {
    helper.loadTestSet<ImportObject[]>('correct-imports').subscribe({
      next: (testSet) => {
        const { input, expectedOutput } = testSet;
        const output = importStatement.extractAllImportObjects(input);
        expect(output).toEqual(expectedOutput);
      },
      complete: () => done(),
    });
  });
});
