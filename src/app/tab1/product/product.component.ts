import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ShoppingCartService } from '../../services/shopping-cart.service';
import { Product } from 'src/app/interfaces/Product';
import { OptionProduct } from 'src/app/interfaces/OptionProduct'; 

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit 
{
  // Tipo de producto
  //* 1 ==> Producto sin opciones ni tamaños ni sabores.
  //* 2 ==> Producto con sabores (flavors).
  //* 3 ==> Producto con tamaño (size).
  //* 4 ==> Producto con opciones (options).
  //* 5 ==> Producto con opciones y tamaños.
  public productType: number; 

  // Producto que se esta comprando.
  public product: Product;

  // Lleva la cuenta de la cantidad de producto.
  public productQuantity: number;

  // Indica si se puede o no agregar al carrito (todas las opciones seleccionadas).
  public isFull: boolean;

  // Valor de agregar el producto al carrito
  public total: number;

  // Observations.
  public observations: string;

  // Cuando es de escoger sabores este guarda el sabor.
  private options: OptionProduct = {};

  constructor(
    private router: Router,
    private shoppingCartService: ShoppingCartService
  ) 
  {     
    this.product = this.shoppingCartService.tempProduct;
    this.productType = this.getProductType();
    this.productQuantity = 1;
    this.observations = '';
  }

  ngOnInit() 
  {}

  /**
   * Añade el producto en el servicio del carrito de compras.
   */
  addToShoppingCart()
  {
    this.options.observations = this.observations;
    this.shoppingCartService.addProduct(this.product, this.productQuantity, this.options, this.productType);
    this.goBack();
  }


  /**
   * Aumenta o disminuye la cantidad de producto que se va comprar.
   * @param plus True => Aumenta, False => Disminuye.
   */
  plusQuantity(plus: boolean)
  {
    if(plus)
    {
      this.productQuantity ++;      
    }
    else
    {
      if(this.productQuantity != 1)
      {
        this.productQuantity --;
      }
    }

    this.processProduct(this.productType);
  }//               ||
  //                ||  
  //                || 
  //                || 
  //                \/           
  /**
   * Calcula el total a pagar según las opciones del producto.
   * @param type 
   */
  processProduct(type: number)
  {
    if(type == 1 || type == 2) //sin opciones, tamaño y sabor no importa.
    {
      this.total = this.product.price * this.productQuantity;
    }
    else if(type == 3) // Tiene que calcularse con el tamaño
    {
      if(!this.options.size) // si aún no se ah seleccionado un tamaño.
      {
        this.total = this.product.initial_price * this.productQuantity;
      }
      else
      {
        this.total = this.options.size.value * this.productQuantity;
      }
    }
    else if(type == 4) // opciones
    {
      if(!this.options.option) // si aún no se ah seleccionado un tamaño.
      {
        this.total = this.product.initial_price * this.productQuantity;
      }
      else
      {
        const additionalValue = this.options.option.additional_value;
        this.total = (this.product.initial_price + additionalValue) * this.productQuantity;
      }
    }
    else if(type == 5) // Opciones y tamaño
    {
      // console.log('Opciones y tamaño');
      let yesOption = false;
      let yesSize = false;

      if(this.options.option) yesOption = true;
      if(this.options.size) yesSize = true;

      if(yesOption && yesSize)
      {
        let additionalValue = this.options.option.additional_value;
        let sizeValue = this.options.size.value;
        this.total = (sizeValue + additionalValue) * this.productQuantity;
        this.isFull = true;
      }
      else
      {
        this.total = this.product.initial_price * this.productQuantity;
      }
    }
  }

  /**
   * Redirige atras al listado de productos.
   */
  goBack()
  {
    this.router.navigate(['/tabs/tab1']);
  }

  // *******************  Datos iniciales para el constructor *********************

    /**
   * Indica que tipo de producto se quiere procesar.
   * 1 ==> Producto sin opciones ni tamaños ni sabores.
   * 2 ==> Producto con sabores (flavors).
   * 3 ==> Producto con tamaño (size).
   * 4 ==> Producto con opciones (options).
   * 5 ==> Producto con opciones y tamaño.
   */
  getProductType(): number
  {
    // 1 Producto sin opciones ni tamaños ni sabores.
    const type1 = !this.product.options && !this.product.size && !this.product.flavors;
    // 2 Producto con sabores (flavors)
    const type2 = !this.product.options && !this.product.size && this.product.flavors;
    // 3 Productos que solo tienen la opción de tamaño (size).
    const type3 = !this.product.options && this.product.size && !this.product.flavors;
    // 4 Producto con opciones.
    const type4 = this.product.options && !this.product.size && !this.product.flavors;
    // 5 Producto con opciones y tamaño.
    const type5 = this.product.options && this.product.size && !this.product.flavors;

    if(type1)
    {
      this.total = this.product.price;
      this.isFull = true;
      return 1;
    }
    else if(type2)
    {
      this.total = this.product.price;
      this.isFull = false;
      return 2;
    }
    else if(type3)
    {
      this.total = this.product.initial_price;
      this.isFull = false;
      return 3;
    }
    else if(type4)
    {
      this.total = this.product.initial_price;
      this.isFull = false;
      return 4;
    }
    else if(type5)
    {
      this.total = this.product.initial_price;
      this.isFull = false;
      return 5;
    }
  }


  // ************TYPE 2 (FLAVORS)************TYPE 2 (FLAVORS)************TYPE 2 (FLAVORS)**********//
  /**
   * Obtiene el sabor de jugo seleccionado.
   * @param $event 
   */
  getFlavorSelected($event: Event)
  {
    this.options = {
      flavor: <string>(<CustomEvent>$event).detail.value
    };
    // console.log('Flavoor: ' + flavor);
    this.isFull = true;
  }

  // ***********Type 3 (Size)***********Type 3 (Size)***********Type 3 (Size)***********//
  /**
   * Obtiene el tamaño seleccionado.
   * @param $event 
   */
  getSizeSelected($event: Event)
  {
    let inputSize = <string>(<CustomEvent>$event).detail.value;

    if(this.productType == 3)
    {
      let full = this.verifySizeSelected(inputSize);
      this.isFull = full;
    }

    // **********Type 5**********Type 5**********Type 5**********Type 5********** //
    if(this.productType == 5)
    { 
      let optionSelected = this.verifyOptionSelected('');
      let sizeSelected = this.verifySizeSelected(inputSize);

      if(optionSelected && sizeSelected)
      {
        this.isFull = true;
      }
    }

    this.processProduct(this.productType);
  }

  // ***********Type 4 (Option)***********Type 4 (Option)***********Type 4 (Option)*********//
  /**
   * Obtiene la opción seleccionada.
   * @param $event 
   */
  getOptionSelected($event: Event)
  {
    let inputOption = (<CustomEvent>$event).detail.value;

    if(this.productType == 4)
    {     
      let full = this.verifyOptionSelected(inputOption);
      this.isFull = full;
    }

    // **********Type 5**********Type 5**********Type 5**********Type 5********** //
    if(this.productType == 5)
    {
      let optionSelected = this.verifyOptionSelected(inputOption);
      let sizeSelected = this.verifySizeSelected('');

      if(optionSelected && sizeSelected)
      {
        this.isFull = true;
      }
    }

    this.processProduct(this.productType);
  }


  // *******VERIFICACIONES*******VERIFICACIONES*******VERIFICACIONES******* //

  verifySizeSelected(input: string): boolean
  {
    if(input != '')
    {
      for(const size of this.product.size) 
      {
        if(input == size.name)
        {
          this.options.size = size;
          return true;
        }
      }
    }

    return false;
  }

  verifyOptionSelected(input: string): boolean
  {
    if(input != '')
    {
      for(const option of this.product.options) 
      {
        if(input == option.name)
        {
          this.options.option = option;
          return true;
        }
      }
    }

    return false;
  }

}
