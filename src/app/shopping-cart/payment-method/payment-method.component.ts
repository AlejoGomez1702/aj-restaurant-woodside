import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

// Payments with Stripe.
// import { Stripe } from '@ionic-native/stripe/ngx';
// import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';

// import { environment } from 'src/environments/environment';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AlertController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
// import { computeStackId } from '@ionic/angular/directives/navigation/stack-utils';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss'],
})
export class PaymentMethodComponent implements OnInit 
{
  public card: boolean;
  public cash: boolean;

  public isCorrectAmmount: boolean;

  // El pedido se puede pagar con tarjeta.
  public acceptCard: boolean;

  // Datos de la tarjeta con la que el cliente va pagar.
  // cardDetails = {
  //   number: '4242424242424242',
  //   expMonth: 12,
  //   expYear: 2020,
  //   cvc: '220'
  // }

  // public backCash: number;

  // Formulario pago con tarjeta(stripe).
  public paymentForm = new FormGroup({
    card_number: new FormControl(''),
    expiry_date: new FormControl(''),
    card_code: new FormControl(''),
  });

  // Formulario para pago en efectivo.
  public cashForm = new FormGroup({
    back_cash: new FormControl('')
  });

  constructor(
    private http: HttpClient,
    private nativeHttp: HTTP,
    private authService: AuthService,
    private shoppingCartService: ShoppingCartService,
    private firebaseService: FirebaseService,
    // private stripe: Stripe,
    // private paypal: PayPal,
    private router: Router,
    public alertController: AlertController,
  ) 
  { 
    this.isCorrectAmmount = false;
    this.card = false;
    this.cash = false;
    //         Si el dinero total del carrito (Subtotal + Tax) es mayor que...               ||
    //            ...el dinero minímo aceptado por el restaurante                            ||
    //                                                                                       ||
    //                                                                                       \/
    this.acceptCard = (this.shoppingCartService.subtotal + this.shoppingCartService.taxTotal) >  
                            (this.firebaseService.generalInformation.minimum_with_card);
  }

  ngOnInit() 
  {
    console.log('*********Lo que hay en el carrito de compras es:');
    console.log(this.shoppingCartService.cartList);
  }

  /**
   * Pagar el pedido con tarjeta (stripe).
   */
  payWithPaypal() 
  {
    this.presentAwaitPaypal();
    this.router.navigate(['woodside/tabs/tab1']);

    // let ammountNumber = (this.shoppingCartService.subtotal + this.shoppingCartService.taxTotal);
    // let ammount: string = ammountNumber.toString();

    // this.paypal.init({
    //   PayPalEnvironmentProduction: '',
    //   PayPalEnvironmentSandbox: environment.paypalClientId
    // }).then(() => {
    //   this.paypal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
    //     acceptCreditCards: false,
    //     languageOrLocale: 'en',
    //     merchantName: 'Pollos Mario Woodside'
    //   })).then(() => {
    //     let payment = new PayPalPayment(ammount, 'USD', 'Order Online - Pollos Mario Woodside', 'sale');
    //     this.paypal.renderSinglePaymentUI(payment).then(() => {
    //       this.presentSaleSuccesfull(); 
    //       this.router.navigate(['woodside/tabs/tab1']);   
    //     }).catch(() => {
    //       console.log('Errroorrr con paypal');
    //       this.router.navigate(['woodside/tabs/tab1']);  
    //     });
    //   })
    // });
  }

  async presentAwaitPaypal()
  {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Soon!',
      message: 'At this moment you cannot pay with PayPal',

    });

    await alert.present();
  }

  /**
   * Realiza un pago en stripe con el token creado posteriormente
   * a introducir los datos de la tarjeta.
   * @param token 
   * @param ammount
   */
  makePayment(token, amount: number) 
  {
    let paymentInformation = {
      amount: amount,
      user: this.firebaseService.user,
    };

    return this.firebaseService.registerPayment(paymentInformation);
  }

  /**
   * Pagar el pedido en la entrega (efectivo).
   */
  async payWithCash()
  {
    const refundMoney = this.cashForm.controls['back_cash'].value;
    this.shoppingCartService.saleInformation.refund_money = refundMoney;

    await this.shoppingCartService.registerSale()
    .then(() => {
      // this.shoppingCartService.refreshCart();    // ***********solucionar
      this.presentSaleSuccesfull(); 
      this.router.navigate(['woodside/tabs/tab1']);   
    }).catch((error) => {
      console.log(error);
    });
  }

  /**
   * Dialogo de compra realizada satisfactoriamente.
   */
  async presentSaleSuccesfull() 
  {
    // console.log('El producto a eliminar es: ');
    // console.log(this.cartList[index]);
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Congratulations!',
      message: 'your order has been completed',

    });

    await alert.present();
  }

  /**
   * Verifica que el monto introducido actualmente por el usuario 
   * sea mayor que el valor del pedido.
   */
  verifyAmmount()
  {
    const priceTotal =  this.shoppingCartService.subtotal + this.shoppingCartService.taxTotal;
    const priceUser = this.cashForm.controls['back_cash'].value;

    if(priceTotal <= priceUser)
    {
      this.isCorrectAmmount = true;
    }else{
      this.isCorrectAmmount = false;
    }
  }

  showInfo()
  {
    console.log('Card ' + this.card);
    console.log('Cash ' + this.cash);
  }

  salir()
  {
    this.authService.logout().then((yes) => {
      this.router.navigate(['shopping-cart']);
    });
  }

}
