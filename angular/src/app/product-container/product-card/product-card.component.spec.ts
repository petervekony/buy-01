import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import {
  HttpClientTestingModule,
  // HttpTestingController,
} from '@angular/common/http/testing';
import { ProductService } from 'src/app/service/product.service';
import { UserService } from 'src/app/service/user.service';
import { MediaService } from 'src/app/service/media.service';
import { ProductCardModalComponent } from '../product-card-modal/product-card-modal.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { MediaGalleryComponent } from 'src/app/media-gallery/media-gallery.component';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  // let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProductCardComponent,
        ProductCardModalComponent,
        MediaGalleryComponent,
      ],
      imports: [
        HttpClientTestingModule,
        MatTabsModule,
        MatIconModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
      ],
      providers: [ProductService, UserService, MediaService],
    });
    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    // httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
