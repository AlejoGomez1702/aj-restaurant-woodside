import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit 
{
  // Listado con los codigos postales(ZIP) válidos para el domicilio del restaurante.
  // private validZips: string[];

  // Formulario con los datos de registro.
  public registerForm = new FormGroup({
    names: new FormControl(''),
    surnames: new FormControl(''),
    street: new FormControl(''),
    street_optional: new FormControl(''),
    zip: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    password: new FormControl('')
  });
  // public registerForm = new FormControl('');

  // Inidica si el código postal introducido es aceptado.
  public isValidZip: boolean;

  // 
  // public zipEnter: string;

  constructor(
    private authService: AuthService
  ) 
  { 
    // this.validZips = this.authService.supportedZip;
    this.isValidZip = false;
    // this.zipEnter = '';
  }

  ngOnInit() 
  {}

  /**
   * Verifica que el código postal introducido por el usuario sea válido.
   */
  verifyZip()
  {
    const enterZip = <string>this.registerForm.controls['zip'].value;
    this.isValidZip = this.authService.validateZipCode(enterZip);
  }

  /**
   * Hace un request a firebase con la información del usuario que se esta registrando.
   */
  registerUser()
  {
    const form = this.registerForm.value;

    this.authService.register(form);

    // console.log(this.registerForm.value);
  }

}
