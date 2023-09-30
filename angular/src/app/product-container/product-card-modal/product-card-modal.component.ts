import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { MediaResponse } from 'src/app/interfaces/media';
import { Product } from 'src/app/interfaces/product';
import { MediaService } from 'src/app/service/media.service';

@Component({
  selector: 'app-product-card-modal',
  templateUrl: './product-card-modal.component.html',
  styleUrls: ['./product-card-modal.component.css'],
})
export class ProductCardModalComponent implements OnInit, OnDestroy {
  @ViewChild('productModal')
    productModal: ElementRef | undefined;

  @Input()
    product!: Product;
  imageSrc: MediaResponse | null = null;
  subscription: Subscription = Subscription.EMPTY;
  placeholder: string = '../../assets/images/placeholder.png';

  constructor(private mediaService: MediaService) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.subscription = this.mediaService
      .getProductMedia(this.product.id!)
      .subscribe({
        next: (data) => {
          this.imageSrc = data;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  getSeverity() {}
}
