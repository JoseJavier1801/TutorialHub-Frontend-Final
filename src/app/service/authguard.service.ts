import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { LoginComponent } from '../page/login/login.component';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService {

  constructor(private router: Router) {

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Check if userId is null
    if (LoginComponent.userId == null) {
      this.router.navigate(['/home']);
      return false;
    }

    return true;
  }
}