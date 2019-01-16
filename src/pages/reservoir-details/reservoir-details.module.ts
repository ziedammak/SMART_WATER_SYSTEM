import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReservoirDetailsPage } from './reservoir-details';

@NgModule({
  declarations: [
    ReservoirDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ReservoirDetailsPage),
  ],
})
export class ReservoirDetailsPageModule {}
