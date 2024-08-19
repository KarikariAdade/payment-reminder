import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css'
})
export class BreadcrumbComponent {

  constructor() {
  }

  @Input() mainPages: any;

  @Input() subPages: any;
}
