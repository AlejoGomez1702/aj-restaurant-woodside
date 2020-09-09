import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service';
import { ImageModalComponent } from './image-modal/image-modal.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page 
{
  public images: string[];

  public sliderOptions = {
    zoom: false,
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 15
  };

  constructor(
    private modalController: ModalController,
    private fbService: FirebaseService,
    private authService: AuthService
  ) 
  {
    this.images = this.fbService.galleryImages;
  }

  /**
   * Abre la imagen con opciones de zoom.
   */
  openPreview(img)
  {
    this.modalController.create({
      component: ImageModalComponent,
      componentProps: {
        img: img
      }
    }).then((modal) => {
      modal.present();
    });

  }

  salir()
  {
    this.authService.logout();
  }

}
