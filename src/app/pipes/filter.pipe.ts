import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../interfaces/Product'; 

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform 
{
  transform(products: Product[], searchType: string): Product[]
  {
    if(searchType && searchType.trim() != '')
    {
      searchType = searchType.toLowerCase();

      const resultProducts = [];
      for(let product of products)
      {

        let withName = product.name.toLowerCase().indexOf(searchType) > -1;
        let isDescription = product.description;
        let withDescription = false;
        if(isDescription)
        {
          withDescription = product.description.toLowerCase().indexOf(searchType) > -1;
        }
        
        // Si el nombre o la descripción coincide.  
        if(withName || (isDescription && withDescription))
        {
          resultProducts.push(product);
        }
      }
  
      return resultProducts;
    }
    else
    {
      return products;
    }
  }
}
