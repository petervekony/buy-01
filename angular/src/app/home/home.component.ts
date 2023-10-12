import {
  // AfterViewInit,
  Component,
  ElementRef,
  // Renderer2,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';

// import { FormStateService } from '../service/form-state.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  @ViewChild('container')
    container: ElementRef | undefined;
  filterSubscription: Subscription = Subscription.EMPTY;
  constructor(
    // private formStateService: FormStateService,
    // private renderer: Renderer2,
  ) {}
  // ngAfterViewInit(): void {
  //   this.filterSubscription = this.formStateService.formOpen$.subscribe(
  //     (isOpen) => {
  //       if (isOpen) {
  //         console.log('open');
  //         if (this.container) {
  //           this.renderer.addClass(
  //             this.container?.nativeElement,
  //             'blur-filter',
  //           );
  //         }
  //       } else {
  //         console.log('close');
  //         if (this.container) {
  //           this.renderer.removeClass(
  //             this.container?.nativeElement,
  //             'blur-filer',
  //           );
  //         }
  //       }
  //     },
  //   );
  // }
}
