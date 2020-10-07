import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartList } from '../interfaces/CartList';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.page.html',
  styleUrls: ['./shopping-cart.page.scss'],
})
export class ShoppingCartPage implements OnInit 
{
  public minimumOrderWithCard: number;

  // Listado de productos en el carrito de compras.
  public cartList: CartList[] = [];

  // Subtotal de todos los productos
  public subtotal: number;

  // Tax total de todos los productos.
  public taxTotal: number;

  // inidica si hay o no productos en el carrito.
  public isEmpty: boolean;

  // Indica si los productos en el carrito cumplen con el pedido minímo.
  public meetsMinimum: boolean;

  // cupon de descuento ingresado por el usuario.
  public couponCode: string;

  constructor(
    private router: Router,
    private shoppingCartService: ShoppingCartService,
    public alertController: AlertController,
    private authService: AuthService,
    private firebaseService: FirebaseService
  ) 
  {
    this.minimumOrderWithCard = 15; // ****************** Consumir dato de firebase
    this.couponCode = '';
    // this.cartList = this.shoppingCartService.cartList;
    // this.calculatePrices();
    this.goToAuthUser(true);
    this.refreshInformation();
  }

  ngOnInit() 
  {
    // this.user = this.firebaseService.getLoginUser();
  }

  /**
   * Dialogo para eliminar un producto del carrito de compras.
   */
  async presentDeleteConfirm(item: CartList, index: number) 
  {
    // console.log('El producto a eliminar es: ');
    // console.log(this.cartList[index]);
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Are you sure to remove the product!',
      message: item.product.name + ' !!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Delete',
          cssClass: 'danger',
          handler: () => {
            // this.cartList.splice(index, 1);
            // this.calculatePrices();
            this.shoppingCartService.deleteProduct(index);
            this.refreshInformation();
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Refresca la información base del carrito de compras.
   */
  refreshInformation()
  {
    this.cartList = this.shoppingCartService.cartList;
    this.subtotal = this.shoppingCartService.subtotal;
    this.taxTotal = this.shoppingCartService.taxTotal;

    // Hay o no productos en la lista del carrito.
    (this.cartList.length == 0) ? this.isEmpty = true : this.isEmpty = false;    

    // Se puede o no pagar con tarjeta de crédito dependiendo del minimo aceptado con este medio.
    ((this.subtotal + this.taxTotal) > this.minimumOrderWithCard) ? this.meetsMinimum = true : this.meetsMinimum = false;
  }

  /**
   * Redirige a la vista de autenticación de usuarios.
   */
  async goToAuthUser(first: boolean)
  {
    let url = '';

    if(this.authService.isLogin)
    {
      await this.authService.getCurrentUser()
      .then((user) => {
        // console.log('Usuario Logueadoooo...')
        this.firebaseService.getUserByUid(user.uid);
      });

      let user = this.firebaseService.getLoginUser();
      // .subscribe((user) => {
        this.authService.user = user;
        if(!user.email || !user.phone || user.addresses.length == 0)
        {
          url = '/auth/complete-data';
        }      
        else
        {
          url = '/shopping-cart/addresses';
        }
      // });
    }
    else
    {
      url = '/auth';
    }

    if(!first)
    {
      this.shoppingCartService.couponCode = this.couponCode;
      this.router.navigate([url]);
    }
  }

  /**
   * Redirige atras al listado de productos.
   */
  goBack()
  {
    this.router.navigate(['/woodside/tabs/tab1']);
  }

}
