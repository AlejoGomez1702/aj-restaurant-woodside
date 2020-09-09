import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Street } from 'src/app/interfaces/Street';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss'],
})
export class AddAddressComponent implements OnInit 
{
  // Listado con los codigos postales(ZIP) válidos para el domicilio del restaurante.
  private validZips: string[];

  // Formulario con los datos para registrar una nueva dirección.
  public addressForm = new FormGroup({
    street: new FormControl(''),
    zip: new FormControl(''),
    street_optional: new FormControl('')
  });

  // Inidica si el código postal introducido es aceptado.
  public isValidZip: boolean;

  constructor(
    private fbService: FirebaseService,
    private authService: AuthService
  ) 
  { 
    this.validZips = this.authService.supportedZip;
    this.isValidZip = false;
  }

  ngOnInit() 
  {}

  /**
   * Verifica que el código postal introducido por el usuario sea válido.
   */
  verifyZip()
  {
    const enterZip = <string>this.addressForm.controls['zip'].value;
    this.isValidZip = this.authService.validateZipCode(enterZip);
  }

  /**
   * Registra una nueva dirección al usuario logueado.
   */
  registerAddress()
  {
    const form = <Street>this.addressForm.value;

    return this.fbService.addAddress(form);
  }



}
