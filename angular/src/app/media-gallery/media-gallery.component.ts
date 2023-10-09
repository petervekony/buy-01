import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-media-gallery',
  templateUrl: './media-gallery.component.html',
  styleUrls: ['./media-gallery.component.css'],
})
export class MediaGalleryComponent {
  @Input()
    images: string[] = [];
  currentIndex = 0;

  prevImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  nextImage() {
    this.currentIndex = (this.currentIndex - 1) % this.images.length;
  }

  get currentImage(): string {
    return this.images[this.currentIndex];
  }
}
