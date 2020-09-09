import { Component } from '@angular/core';
// import { FirebaseService } from '../services/firebase.service';
import { UserAuth } from '../interfaces/UserAuth';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page 
{
  // Usuario logueado.
  public user: UserAuth;

  constructor(
    private authService: AuthService,
    private firebaseService: FirebaseService,
    public alertController: AlertController,
    private router: Router
  ) 
  {
    this.user = this.firebaseService.user;
  }

  /**
   * Cerrar sesión.
   */
  logout()
  {
    this.authService.logout().then(() => {
      this.firebaseService.user = null;
      this.firebaseService.updateUserAuthState();
      this.presentSaleSuccesfull();
      this.router.navigate(['/tabs/tab1']);
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
      header: 'Successful!',
      message: 'You have logged out',
    });

    await alert.present();
  }

}
