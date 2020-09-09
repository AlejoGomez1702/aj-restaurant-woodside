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

  constructor(
    private authService: AuthService,
    private router: Router 
  ) 
  { }

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
   * Iniciar Sesión con google.
   */
  // signInWithGoogle()
  // {
  //   this.authService.googleSignin();
  // }

  /**
   * Redirige a la página para registrar un usuario.
   */
  goToRegisterUrl()
  {
    this.router.navigate(['/auth/register'])
  }

}
