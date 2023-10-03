import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormStateService } from '../service/form-state.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  @ViewChild('productDialog')
    productDialog: ElementRef | undefined;
  @ViewChild('user-dialog')
    userDialog: ElementRef | undefined;
  showProductForm = false;
  showUserForm = false;
  constructor(private formStateService: FormStateService) {
    this.formStateService.formOpen$.subscribe((isOpen) => {
      this.showProductForm = isOpen;
    });
  }

  manageProducts(event: MouseEvent) {
    console.log('here');
    this.formStateService.setFormOpen(true);
    if (this.productDialog) {
      this.productDialog.nativeElement.show();
    }
    event.preventDefault();
  }
  openProfileForm(event: MouseEvent) {
    console.log('yeah, open the modal');
    event.preventDefault();
  }
}
