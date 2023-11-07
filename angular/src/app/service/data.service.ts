import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  //eslint-disable-next-line
  private dataSource = new BehaviorSubject<any>(null);
  data$ = this.dataSource.asObservable();

  private idSource = new BehaviorSubject<string>('');
  ids$ = this.idSource.asObservable();

  private deleteImageSource = new BehaviorSubject<number>(0);
  deleteImage$ = this.deleteImageSource.asObservable();

  //eslint-disable-next-line
  sendData(data: any): void {
    this.dataSource.next(data);
  }

  sendProductId(data: string): void {
    console.log('dataservice SENDproductId', data);
    this.idSource.next(data);
  }

  changeDeleteIndex(data: number): void {
    console.log('changeDeleteIndex:', data);
    this.deleteImageSource.next(data);
  }
}
