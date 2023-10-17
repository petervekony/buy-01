import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  //eslint-disable-next-line
  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();

  private idStream = new BehaviorSubject<string>('');
  ids$ = this.idStream.asObservable();

  private deleteImageSource = new BehaviorSubject<number>(0);
  deleteImage$ = this.deleteImageSource.asObservable();

  //eslint-disable-next-line
  sendData(data: any): void {
    this.dataSubject.next(data);
  }

  sendProductId(data: string): void {
    this.idStream.next(data);
  }

  changeDeleteIndex(data: number): void {
    this.deleteImageSource.next(data);
  }
}
