import {
  // AfterViewInit,
  Component,
  // Renderer2,
} from '@angular/core';

// import { Subscription } from 'rxjs';

// import { FormStateService } from '../service/form-state.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  // filterSubscription: Subscription = Subscription.EMPTY;
  constructor(
    // private formStateService: FormStateService,
    // private renderer: Renderer2,
  ) {
  }
  // ngAfterViewInit(): void {
  //   console.log('this.container', this.container);
  //   this.filterSubscription = this.formStateService.formOpen$.subscribe(
  //     (isOpen) => {
  //       if (isOpen) {
  //         console.log(isOpen);
  //         if (this.container) {
  //           this.renderer.addClass(
  //             this.container.nativeElement,
  //             'blur-filter',
  //           );
  //           console.log(this.container.nativeElement.classList);
  //         }
  //       } else {
  //         console.log(isOpen);
  //         if (this.container) {
  //           this.renderer.removeClass(
  //             this.container.nativeElement,
  //             'blur-filer',
  //           );
  //           console.log(this.container.nativeElement.classList);
  //         }
  //       }
  //     },
  //   );
  // }
}
