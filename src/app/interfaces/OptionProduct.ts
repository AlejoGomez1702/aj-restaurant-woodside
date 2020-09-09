export interface OptionProduct
{
    option?: {   
        name: string,
        additional_value: number     
    },
    flavor?: string,
    size?: {
        name: string,
        tax?: number,
        value?: number
    },

    //Observaciones del producto.
    observations?: string
}