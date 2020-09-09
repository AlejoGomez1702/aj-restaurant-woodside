import { Street } from './Street';
import { CartList } from './CartList';

export interface Sale
{
    // saleInformation (Direccion de envio || se recoge en el restaurante)
    sale_information: {
        pikup: boolean,
        address?: Street,
        with_card?: boolean,
        refund_money?: number
    },

    subtotal: number,
    tax_total: number,
    total: number,
    coupon_code?: string,

    cart_list: CartList[],

    user: {
        email: string,
        uid: string
    }
}