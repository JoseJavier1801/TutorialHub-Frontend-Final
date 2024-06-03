// login.service.ts
import { Injectable } from '@angular/core';
import { SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { GoogleLoginProvider } from "@abacritt/angularx-social-login";
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { TeacherService } from './teacher.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  user!: SocialUser;
  loggedIn!: boolean;
  originalPath!: string;

  constructor(
    private authService: SocialAuthService,
    private router: Router,
    private userService: UserService,
    private teacherService: TeacherService
  ) {
    this.authService.authState.subscribe(async (user) => {
      this.user = user;
      this.loggedIn = (user != null);

      if (this.loggedIn) {
        if (this.originalPath) {
          this.router.navigate([this.originalPath]);
          this.originalPath = '';
        } else {
          this.router.navigate(['']);
        }
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  async refreshToken(): Promise<void> {
    await this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }

  async signOut(): Promise<void> {
    await this.authService.signOut();
  }

  async loginUserWithUsernameAndPassword(username: string, password: string): Promise<boolean> {
    const userResult = await this.userService.loginClientWithUsernameAndPassword(username, password);
    const teacherResult = await this.teacherService.loginTeacherWithUsernameAndPassword(username, password);

    return userResult !== null || teacherResult !== null;
  }
}