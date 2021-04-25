import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { InputHandlerService } from 'src/app/services/input-handler.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  readonly codeBoxForm: FormGroup;

  constructor(private inputHandler: InputHandlerService, private fb: FormBuilder) {
    this.codeBoxForm = this.fb.group({
      code: []
    });
   }

  ngOnInit(): void {
    const codeOutput$ = this.codeBoxForm.get('code')?.valueChanges;
    if (codeOutput$) {
      this.inputHandler.parse(codeOutput$);
    }
  }

}
