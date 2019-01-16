import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ReservoirDetailsPage } from '../pages/reservoir-details/reservoir-details'
import { AddReservoirPage } from '../pages/add-reservoir/add-reservoir'
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { HttpModule } from '@angular/http';
import { ReservoirEditPage } from '../pages/reservoir-edit/reservoir-edit';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ReservoirDetailsPage,
    AddReservoirPage,
    ReservoirEditPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ReservoirDetailsPage,
    AddReservoirPage,
    ReservoirEditPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider
  ]
})
export class AppModule {}
