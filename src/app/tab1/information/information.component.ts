import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service'; 

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss'],
})
export class InformationComponent
{
  // Imagenes de los medios de pago disponibles.
  public paymentsImages: string[];

  constructor(
    private router: Router,
    private storageFirebase: FirebaseService
  ) 
  {
    this.paymentsImages = this.storageFirebase.paymentsImages;
    console.log(this.storageFirebase.paymentsImages);
  }

  /**
   * Regresa a la página de listado de productos.
   */
  goBack()
  {
    this.router.navigate(['/tabs/tab1'])
  }

}
