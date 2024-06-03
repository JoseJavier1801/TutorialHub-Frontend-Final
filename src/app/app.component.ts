import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { NavComponent } from './components/nav/nav.component';
import { ClassComponent } from './page/class/class.component';
import { SeekerComponent } from './page/seeker/seeker.component';
import { LoginComponent } from './page/login/login.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavComponent, ClassComponent, SeekerComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isLoggedIn: boolean = false;
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  isNavActivated = false;
  isNavbarActivated = true;

  constructor(private router: Router) { 
    defineCustomElements();
  }

  handleLoginSuccess() {
    // Actualizar las variables de estado en función del evento emitido por app-login
    this.isNavActivated = !this.isNavActivated;
    this.isNavbarActivated = !this.isNavbarActivated;

    // Navegar a la página /class
    this.router.navigate(['/class']);
  }

  handleToggleNavbar(value: boolean) {
    // Actualizar la variable de estado según el evento emitido por app-login
    this.isNavbarActivated = value;
    this.isNavActivated = !value; // Invertir el valor para la visibilidad de NavComponent
  }
}