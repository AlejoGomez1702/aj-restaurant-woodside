import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShoppingCartPageRoutingModule } from './shopping-cart-routing.module';

import { ShoppingCartPage } from './shopping-cart.page';
import { AddressesComponent } from './addresses/addresses.component';
import { AddAddressComponent } from './add-address/add-address.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { CardNumberPipe } from '../pipes/card-number.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShoppingCartPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ShoppingCartPage, 
    AddressesComponent, 
    AddAddressComponent, 
    PaymentMethodComponent,
    CardNumberPipe
  ]
})
export class ShoppingCartPageModule {}
