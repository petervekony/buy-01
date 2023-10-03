import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  @ViewChild('productDialog')
    productDialog: ElementRef | undefined;
  constructor() {}

  manageProducts(event: MouseEvent) {
    console.log('here');
    if (this.productDialog) {
      this.productDialog.nativeElement.show();
    }
    event.preventDefault();
  }
  openProfileForm(event: MouseEvent) {
    event.preventDefault();
  }
}
