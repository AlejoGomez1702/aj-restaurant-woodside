import { Component, OnInit } from '@angular/core';
import { ProductsList } from '../interfaces/ProductsList';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { ShoppingCartService } from '../services/shopping-cart.service';

import { Inject }  from '@angular/core';
import { DOCUMENT } from '@angular/common'; 
import { Product } from '../interfaces/Product';
import { GeneralInformation } from '../interfaces/GeneralInformation';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit
{
  public firstHeader: boolean;
  public coverPageURL: String;
  // Productos ofertados en el negocio.
  public products: ProductsList[] = [];

  // Valor del toolbar de productos (va cambiando a medida que cambia la categoria).
  public category: string = 'ANTOJITOS';

  // Para ir filtrando la lista de productos
  public filterList: string;

  // Información general sobre el restaurante.
  public generalInformation: GeneralInformation;

  constructor
  (
    private router: Router,
    @Inject(DOCUMENT) document,
    private firebaseService: FirebaseService,
    public shoppingCartService: ShoppingCartService
  ) 
  {
    this.firstHeader = true;  
    this.initInformation();
  }

  ngOnInit()
  {    
    this.initInformation();
  }

  /**
   * Inicializar toda la información necesaria.
   */
  initInformation()
  {
    this.coverPageURL = this.firebaseService.coverPageURL;
    this.products = this.firebaseService.products;  
    this.generalInformation = this.firebaseService.generalInformation;
  }

  /**
   * Prepara la vista para agregar un producto al carrito.
   * @param productInfo 
   */
  addToCart(productInfo: Product)
  {
    this.shoppingCartService.addProductToCart(productInfo);
  }

  /**
   * Se acciona cuando queremos ir a la página de información del restaurante
   * @param $event 
   */
  startInformationPage()
  {
    this.router.navigate(['/woodside/tabs/tab1/information'])
  }

  /**
   * Cuando se quiere ir a la página del carrito de compras.
   */
  goToShoppingCartUrl()
  {
    this.router.navigate(['/shopping-cart'])
  }

  // ********EVENTS********EVENTS********EVENTS********EVENTS********EVENTS**********//

  /**
   * Evento al cambiar entre categorias de productos.
   * @param $event 
   */
  segmentChanged($event:Event)
  {
    // console.log('jajajja');
  }

  /**
   * Indica si se muestra la barra inicial o la barra de categorias de productos.
   * @param $event 
   */
  verifyTopBar($event:Event)
  {
    // 300 pixeles se cambia el toolbar principal
    const pointForChange = 300;
    const valueScroll = (<CustomEvent>$event).detail.scrollTop;

    this.changeSection(valueScroll);

    // Condición (If ternario)
    (valueScroll >= pointForChange) ? this.firstHeader = false : this.firstHeader = true;
  }

  /**
   * Al dar click me mueve hasta la categoria que corresponde.
   * @param $event 
   */
  scrollToCategory($event: Event, category: string)
  {
    let scrollTo = document.getElementById(category);
    scrollTo.scrollIntoView();
  }

  /**
   * Mueve el toolbar dependiendo en que sección de categorias este parado el cliente.
   */
  changeSection(valueScroll: number)
  {
    for (let i = 0; i < this.products.length; i++) 
    {
      let section = this.products[i];
      let category = section.category;
      let topPx = document.getElementById(category).offsetTop;   

      if(valueScroll >= topPx)
      {
        this.category = this.products[i].category;
      }    
    }
  }


}
