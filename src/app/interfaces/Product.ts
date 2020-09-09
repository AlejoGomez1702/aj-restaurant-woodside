import { Size } from './Size';
import { Option } from './Option';

export interface Product
{
    best_seller?: boolean,
    category?: string,
    description?: string,
    name: string,
    photo_name?: string,
    price?: number,
    tax?: number,

    // Opciones
    options?: Option[],
    size?: Size[],
    flavors?: string[]

    // Precios
    initial_price?: number,
    end_price?: number
}