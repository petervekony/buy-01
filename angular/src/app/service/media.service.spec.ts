import { TestBed } from '@angular/core/testing';

import { MediaService } from './media.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('MediaService', () => {
  let service: MediaService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MediaService],
    });
    service = TestBed.inject(MediaService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('should get product media', () => {
  //   const mockMedia: Media[] = [{/* ... mock media data ... */}];

  //   service.getProductMedia().subscribe((media) => {
  //     expect(media).toEqual(mockMedia);
  //   });

  //   const req = httpTestingController.expectOne(
  //     `${environment.productMediaURL}`,
  //   );
  //   expect(req.request.method).toEqual('GET');

  //   req.flush(mockMedia);
  // });
});
