import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {

  constructor() {
  }

  @Input() type:any = ''

  @Input() message: any = ''

}
