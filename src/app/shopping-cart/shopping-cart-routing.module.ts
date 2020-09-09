import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShoppingCartPage } from './shopping-cart.page';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { AddressesComponent } from './addresses/addresses.component';
import { AddAddressComponent } from './add-address/add-address.component';

const routes: Routes = [
  {
    path: '',
    component: ShoppingCartPage
  },
  {
    path: 'addresses',
    component: AddressesComponent
  },
  {
    path: 'add-address',
    component: AddAddressComponent
  },
  {
    path: 'payment',
    component: PaymentMethodComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShoppingCartPageRoutingModule {}
