import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginComponent } from '../../page/login/login.component';
import { SettingsComponent } from '../settings/settings.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterModule,CommonModule,SettingsComponent],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent {
  private _isLoggedIn: boolean = false;
 
  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  @Input()
  set isLoggedIn(value: boolean) {
    this._isLoggedIn = value;
  }

  @Output() closeNav = new EventEmitter<void>();

  constructor(private router: Router) { }
/**
 * Funcion para cerrar sesion 
 */
  cerrarSesion() {
    this._isLoggedIn = false;
    this.router.navigate(['/home']);
    this.closeNav.emit();
  }
/**
 *  Funcion para saber si la ruta actual es '/home' o '/register'
 * @returns true si la ruta actual es '/home' o '/register', false en caso contrario
 */
  isRestrictedRoute(): boolean {
    const currentRoute = this.router.url;
    return currentRoute === '/home' || currentRoute === '/register';
  }
  openBizum() {
    // Abre la página de Bizum en una nueva ventana
    window.open('https://www.bizum.es/', '_blank');
  }
}