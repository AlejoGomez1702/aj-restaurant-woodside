import { Product } from './Product';
import { OptionProduct } from './OptionProduct';

export interface CartList
{
    // Tipo de producto
    //* 1 ==> Producto sin opciones ni tamaños ni sabores.
    //* 2 ==> Producto con sabores (flavors).
    //* 3 ==> Producto con tamaño (size).
    //* 4 ==> Producto con opciones (options).
    //* 5 ==> Producto con opciones y tamaños.
    type: number,
    quantity: number, 
    product: Product, 
    options: OptionProduct,
    total_tax?: number,
    price_total?: number
}