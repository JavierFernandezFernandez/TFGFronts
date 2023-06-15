import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
    const token = localStorage.getItem('token');
    if (token) {
      this.isLoggedIn$.next(true);
    }
  }

  public get isLoggedIn(): BehaviorSubject<boolean> {
    return this.isLoggedIn$;
  }

  public setLoggedIn(value: boolean): void {
    this.isLoggedIn$.next(value);
  }
}
