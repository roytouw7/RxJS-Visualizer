import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ImportStatement } from '../classes/import-statement';

@Injectable({
  providedIn: 'root',
})
export class InputHandlerService {
  private readonly importStatement = new ImportStatement();

  constructor() {}

  parse(code$: Observable<string>): void {
    code$.pipe(map((code) => this.importStatement.extractAllImportObjects(code))).subscribe(console.log);
  }
}
