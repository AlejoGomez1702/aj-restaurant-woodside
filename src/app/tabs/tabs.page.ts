import { Component } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage 
{
  // Indica si hay un usuario logueado o no.
  public isLogin: boolean;

  constructor(
    private fbService: FirebaseService
  ) 
  {
    this.verifyUserAuth();
    this.fbService.updateStateAuth$.subscribe(() => {
      this.verifyUserAuth();
    });
  }

  /**
   * Verifica que haya un usuario logueado en el sistema.
   */
  verifyUserAuth()
  {
    if(this.fbService.user != null)
    {
      this.isLogin = false;
    }
    else
    {
      this.isLogin = true;
    }
  }

}
