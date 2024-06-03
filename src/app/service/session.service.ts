import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  setClientId(id: number) {
    throw new Error('Method not implemented.');
  }
  private userId: number | null = null;

  constructor() { }

  setUserId(userId: number): void {
    this.userId = userId;
  }

  getUserId(): number | null {
    return this.userId;
  }

  clearUserId(): void {
    this.userId = null;
  }

  isLoggedIn(): boolean {
    return this.userId !== null;
  }
}
