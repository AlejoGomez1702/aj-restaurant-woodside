import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit 
{
  // Correo y contraseña ingresados por el usuario.
  public loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  // Se quiere mostrar la contraseña o no.
  public showPassword: boolean;
  public passwordToggleIcon: string;

  constructor(
    private authService: AuthService,
    private router: Router 
  ) 
  { 
    this.showPassword = false;
    this.passwordToggleIcon = 'eye';
  }

  ngOnInit() 
  {
  }

  /**
   * Inicia sesión a un usuario con correo y contraseña.
   */
  login()
  {
    this.authService.login(this.loginForm.value).then((response) => {
      console.log(response);
      this.router.navigate(['/shopping-cart']);
    }).catch((error) => {
      console.log(error);
    });
    // console.log('Is Login ==> ' + isLogin);
    // this.router.navigate(['/shopping-cart'])
    // console.log(this.loginForm.value);
  }

  /**
   * Iniciar sesión con google.
   */
  loginWithGoogle()
  {
    this.authService.loginWithGoogle();
  }

  /**
   * Iniciar sesión con facebook.
   */
  loginWithFacebook()
  {
    this.authService.loginWithFacebook();
  }

  /**
   * Permite mostrar o no la contraseña ingresada por el usuario.
   */
  changeStatePassword(): void
  {
    // Si no se muestra la contraseña y se quiere mostrar entonces...
    if(!this.showPassword)
    {
      this.showPassword = true;
      this.passwordToggleIcon = 'eye-off';
    }
    else
    {
      this.showPassword = false;
      this.passwordToggleIcon = 'eye';
    }
  }

  /**
   * Redirige a la página para registrar un usuario.
   */
  goToRegisterUrl()
  {
    this.router.navigate(['/auth/register'])
  }

}
