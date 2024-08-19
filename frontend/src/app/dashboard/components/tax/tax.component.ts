import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import * as console from "node:console";

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrl: './tax.component.css'
})
export class TaxComponent implements OnInit{

  constructor(
    private formBuilder: FormBuilder,
  ) {
  }

  showTaxForm:boolean = true;

  hasError = false

  errorMessage: string = ''

  errorType: string = ''

  taxesForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    amount: new FormControl('', [Validators.required, Validators.min(1)])
  });

  submitTaxForm() {
    console.log('tax submission', this.taxesForm.value)
  }

  ngOnInit(): void {
  }

  toggleTaxForm() {
    this.showTaxForm =!this.showTaxForm;
  }
}
