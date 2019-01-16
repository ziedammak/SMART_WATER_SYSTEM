import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddReservoirPage } from './add-reservoir';

@NgModule({
  declarations: [
    AddReservoirPage,
  ],
  imports: [
    IonicPageModule.forChild(AddReservoirPage),
  ],
})
export class AddReservoirPageModule {}
