// shared.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private isPetitionVisibleSubject = new BehaviorSubject<boolean>(false);
  isPetitionVisible$ = this.isPetitionVisibleSubject.asObservable();

  setPetitionVisibility(visibility: boolean): void {
    this.isPetitionVisibleSubject.next(visibility);
  }
}
