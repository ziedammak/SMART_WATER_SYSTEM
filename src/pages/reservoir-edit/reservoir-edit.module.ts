import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReservoirEditPage } from './reservoir-edit';

@NgModule({
  declarations: [
    ReservoirEditPage,
  ],
  imports: [
    IonicPageModule.forChild(ReservoirEditPage),
  ],
})
export class ReservoirEditPageModule {}
