import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthPageRoutingModule } from './auth-routing.module';

import { AuthPage } from './auth.page';
import { RegisterComponent } from './register/register.component';
import { CompleteDataComponent } from './complete-data/complete-data.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthPageRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [AuthPage, RegisterComponent, CompleteDataComponent]
})
export class AuthPageModule {}
