import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, Loading, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { LoginPage } from '../login/login'

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  })

export class RegisterPage {

  responseData: any;
  loading: Loading;
  createSuccess = false;
  registerCredentials = { name: '', email: '', password: '', confirmation_password: '' };

  constructor(
    private nav: NavController,
    private auth: AuthServiceProvider,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
  ) { }

  public register() {
    if (this.registerCredentials.password != this.registerCredentials.confirmation_password) {
      this.showPopup("Error", "Password don't match confirmation password !");
    }
    else if (!this.isEmail(this.registerCredentials.email)) {
      this.showPopup("Error", "Email incorrect !")
    }
    else if (!this.validatePassword(this.registerCredentials.password))
    {
      this.showPopup("Error", "Password should contain at list : 6 characters, a number, a special character !")
    }
    else {
      this.auth.register(this.registerCredentials).then(
        result => {
          this.showLoading();
          this.responseData = result;
          console.log(result);
          if (result != null) {
            this.createSuccess = true;
            this.showPopup("fine", "Successfully registered");
            this.nav.setRoot('LoginPage');

          }
          else {
            this.showPopup("Error", "Register failed ,Try again later!");
          }
        },
        err => {
          {
            this.showPopup("Error", "Register failed ,Try again later!");
          }
        }
      );
    }
  }
  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            if (this.createSuccess) {
              this.nav.popToRoot();
            }
          }
        }
      ]
    });
    alert.present();
  }
  isEmail(search: string): boolean {
    var serchfind: boolean;

   var  regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    serchfind = regexp.test(search);

    return serchfind
  }
  validatePassword(pass: string): boolean {
    var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,50}$/;
    return regularExpression.test(pass);
  }
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }
}
