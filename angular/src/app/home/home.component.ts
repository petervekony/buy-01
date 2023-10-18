import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormStateService } from '../service/form-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  formSubscription: Subscription = Subscription.EMPTY;
  blurWrap: HTMLElement;

  constructor(private formStateService: FormStateService) {
    this.blurWrap = document.getElementById('blur-wrap')!;
  }

  ngOnInit(): void {
    // this.formSubscription = this.formStateService.formOpen$.subscribe(
    //   (isOpen) =>
    //     isOpen
    //       ? this.blurWrap.classList.add('blur-filter')
    //       : this.blurWrap.classList.remove('blur-filter'),
    // );
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
  }
}
