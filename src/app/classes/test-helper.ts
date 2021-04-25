import * as fs from 'fs';
import { combineLatest, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TestSet } from '../contracts/test-set';

export class TestHelper {
  private readonly basePath = './src/app/test-assets/';

  /** Read source file and expected output json file, return as Observable<TestSet>. */
  public loadTestSet<OutputType>(fileName: string): Observable<TestSet<string, OutputType>> {
    const sourceFile$ = this.readSourceFile(fileName);
    const expectedOutput$ = this.readJson<OutputType>(fileName);

    return combineLatest([sourceFile$, expectedOutput$]).pipe(
      map((testSet) => {
        const [input, expectedOutput] = testSet;
        return { input, expectedOutput };
      }),
      catchError((err) => {
        throw new Error(`Error loading ${fileName}! ${err}`);
      }),
    );
  }

  public readSourceFile(file: string, format = 'ts'): Observable<string> {
    return new Observable((subscriber) => {
      fs.readFile(`${this.basePath}/${file}.${format}`, 'utf8', (err, data) => {
        if (err) {
          subscriber.error(err);
        }
        subscriber.next(data);
        subscriber.complete();
      });
    });
  }

  public readJson<OutputType>(file: string): Observable<OutputType> {
    return new Observable((subscriber) => {
      fs.readFile(`${this.basePath}/${file}.json`, 'utf8', (err, data) => {
        if (err) {
          subscriber.error(err);
        }

        try {
          subscriber.next(JSON.parse(data));
          subscriber.complete();
        } catch (e) {
          const error = new Error(`Error parsing ${file}!`);
          subscriber.error(error);
        }
      });
    });
  }
}
