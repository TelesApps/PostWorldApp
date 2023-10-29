import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  public screenWidthSubj: BehaviorSubject<number> = new BehaviorSubject<number>(1920);
  private themeClass: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() { }

  getThemeClass() {
    return this.themeClass.asObservable();
  }

  changeTheme() {
    const themeClass = this.themeClass.getValue();
    if(themeClass) {
      this.themeClass.next('');
    } else {
      this.themeClass.next('dark-theme');
    }
  }
}
