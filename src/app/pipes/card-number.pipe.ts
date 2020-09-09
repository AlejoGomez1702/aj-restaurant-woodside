import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cardNumber'
})
export class CardNumberPipe implements PipeTransform 
{
  transform(numberInput: string): string 
  {
    const length = numberInput.length;
    if(length == 4 || length == 9 || length == 14) // Cada 4 cifras coloco un espacio.
    {
      return numberInput += ' ';
    }

    return numberInput;
  }

}
