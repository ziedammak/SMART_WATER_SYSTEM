import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, AlertController } from 'ionic-angular';
import { User } from '../../models/users'
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ResToCreate } from '../../models/resToCreate';

/**
 * Generated class for the AddReservoirPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-reservoir',
  templateUrl: 'add-reservoir.html',
})
export class AddReservoirPage {

  listOfUsers: User[]
  listOfFiltredUsers: User[]
  addCredentials = { name: '', max: '' };
  loading: Loading;
  responseData: any;


  constructor(private auth: AuthServiceProvider, public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
    //this.initializeItems();
  }
  initializeItems() {
    this.listOfUsers = JSON.parse(localStorage.getItem("users"));
    this.listOfFiltredUsers = this.listOfUsers;
    console.log(this.listOfFiltredUsers);
  }
  ionViewDidLoad() {
    var l: User[] = [];
    this.auth.GetAllUsers().then(result => {
      this.responseData = result
      for (let user of this.responseData) {
        var u = new User(user.id, user.email, false);
        l.push(u);
      }
      this.listOfUsers = l;
      this.listOfFiltredUsers = this.listOfUsers;
      localStorage.setItem("users", JSON.stringify(l));
    },
      err => {
        {
          this.showPopup("Error"," failed ,Check internet connection !");
        }
      }
    );
  }
  add() {
    if (this.addCredentials.name.length < 6)
      this.showPopup("Error", "Reservoir name should contain at list 6 characters ...")
    else {
      this.presentConfirm();
    
    }
  }
  getItems(ev: any) {

    this.listOfFiltredUsers = this.listOfUsers;

    const val = ev.target.value;

    if (val && val.trim() != '') {
      this.listOfFiltredUsers = this.listOfUsers.filter((item) => {
        return (item.Mail.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  checkItemState(id) {
    var arrayIndex = this.listOfUsers.findIndex(r => r.Id == id);
    this.listOfUsers[arrayIndex].IsChecked = !this.listOfUsers[arrayIndex].IsChecked;
  }
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }
  endLoading() {
    this.loading.dismiss();
  }
  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
        {
          text: 'OK',
        }
      ]
    });
    alert.present();
  }
  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Confirm purchase',
      message: 'please click submit, if you want to create a reservoir with those information',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Submit',
          handler: () => {
            var x: User[] = this.listOfUsers.filter((item) => {
              return (item.IsChecked == true);
            })
            var listOfUsers: any[] = [];
            for (let xx of x)
              listOfUsers.push(xx.Id);
            var resToCreate: ResToCreate = new ResToCreate(this.addCredentials.name, this.addCredentials.max, listOfUsers);

            this.auth.CreateRes(resToCreate).then(result => {
              this.responseData = result
              this.showPopup("Reservoir Id", this.responseData.id);
              this.navCtrl.pop();
            },
              err => {
                {
                  this.showPopup("Error", " failed ,Check internet connection !");
                }
              }
            );
          }
        }
      ]
    });
    alert.present();
  }
}
