import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  //eslint-disable-next-line
  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();

  //eslint-disable-next-line
  sendData(data: any) {
    this.dataSubject.next(data);
  }
}
