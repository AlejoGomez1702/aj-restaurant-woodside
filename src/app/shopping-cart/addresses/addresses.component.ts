import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UserAuth } from 'src/app/interfaces/UserAuth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss'],
})
export class AddressesComponent implements OnInit
{
  // Usuario actualmente logueado.
  public user: UserAuth;

  // Dirección mapeada para saber cual se selecciona.
  public addresses: boolean[];

  // Indica si se selecciono una opción de dirección.
  public isAddressSelected: boolean;

  // Inidica si el pedido se va tomar en el restaurante o no.
  public pickup: boolean;

  // Sirve para que la página se refresca con una nueva dirección.
  // mySubscription: any;

  constructor(
    private fbService: FirebaseService,
    private shoppingCartService: ShoppingCartService,
    private router: Router
  ) 
  {
    this.pickup = false;
    this.initInformation();
    this.fbService.componentMethodCalled$.subscribe(() => {
      this.initInformation();
    });
  }

  ngOnInit() 
  {
  }

  /**
   * Inicializa la información que necesita la vista.
   */
  initInformation()
  {
    this.isAddressSelected = false;

    this.user = this.fbService.getLoginUser();

    // this.fbService.getLoginUser().subscribe((user) => {
    //   this.user = user;
    // });

    const numAddresses = this.user.addresses.length;
    this.addresses = [];
    for (let i = 0; i < numAddresses; i++) 
    {
      this.addresses[i] = false;
    }
  }

  /**
   * 
   * @param index 
   */
  verifyAddress(index: number): boolean
  {    
    // console.log('pickup');
    // console.log(this.pickup);
    let selected = false;
    for (const address of this.addresses) 
    {
      if(address)
      {
        selected = true;
        break;
      }
    }

    // Si no hay ningúno seleccionado, se selecciona como primero.
    if(!selected)
    {
      this.addresses[index] = true;
      this.isAddressSelected = true;
      return true;
    }    
    else if(selected && this.addresses[index]) // Si esta seleccionado lo voy a desseleccionar.
    {
      this.addresses[index] = false;
      this.isAddressSelected = false;
      return false;
    }
    else if(selected) // Si voy a seleccionar otra dirección a la ya seleccionada.
    {
      for (let i = 0; i < this.addresses.length; i++) 
      {
        const element = this.addresses[i];
        if(element)
        {
          this.addresses[i] = false;
          this.addresses[index] = true;
          return true;
        }
      }
    }
  }

  /**
   * Escribe en el servicio del carrito de compras los datos de la dirección.
   */
  procesAddress()
  {
    // Si el pedido se va tomar en el restaurante.
    if(this.pickup)
    {
      this.shoppingCartService.saleInformation = {pikup: true};
    }
    else{ // Si se requiere a domicilio
      const index = this.getSelectedAddress();
      const address = this.user.addresses[index];
      
      this.shoppingCartService.saleInformation = {pikup: false, address: address};
    }

    console.log('Información de la dirección: ');
    console.log(this.shoppingCartService.saleInformation);

    this.goToPaymentUrl();
  }

  /**
   * Obtiene el indice de la dirección seleccionada por el usuario.
   */
  getSelectedAddress(): number
  {
    for (let i = 0; i < this.addresses.length; i++) 
    {
      const address = this.addresses[i];
      if(address)
      {
        return i;
      }
    }
  }

  /**
   * Me dirige al componente para agregar una nueva dirección al usuario.
   */
  goToaddUserAddress()
  {
    this.router.navigate(['shopping-cart/add-address']);
  }

    /**
   * Me dirige al componente para realizar el pago del pedido.
   */
  goToPaymentUrl()
  {
    this.router.navigate(['shopping-cart/payment']);
  }

}
