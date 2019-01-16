import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, AlertController } from 'ionic-angular';
import { User } from '../../models/users'
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ResToCreate } from '../../models/resToCreate';
import { Reservoir } from '../../models/reservoir';
import { HomePage } from '../home/home';

/**
 * Generated class for the ReservoirEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reservoir-edit',
  templateUrl: 'reservoir-edit.html',
})
export class ReservoirEditPage {

  listOfUsers: User[]
  listOfFiltredUsers: User[]
  addCredentials = { name: '', max: '' };
  loading: Loading;
  responseData: any;
  reservoir: Reservoir;


  constructor(private auth: AuthServiceProvider, public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
    this.setUsersInLocalStorage();
    //this.initializeItems();
  }
  initializeItems() {
    this.listOfUsers = JSON.parse(localStorage.getItem("users"));
    console.log(this.listOfUsers);
    this.reservoir = this.navParams.get('res');
    this.addCredentials.name = this.reservoir.Name;
    this.addCredentials.max = String(this.reservoir.Max);
    for (let id of this.reservoir.ListOfUsers) {
      this.checkItemState(id)
      console.log(this.listOfUsers);
    };
    this.listOfFiltredUsers = this.listOfUsers;
    
    console.log(this.listOfFiltredUsers);
  }
  setUsersInLocalStorage() {
    var l: User[] = [];
    this.auth.GetAllUsers().then(result => {
      this.responseData = result
      for (let user of this.responseData) {
        var u = new User(user.id, user.email, false);

        l.push(u);
      }
      console.log(l);
      this.listOfUsers = l;
      console.log(this.listOfUsers);
      this.reservoir = this.navParams.get('res');
      this.addCredentials.name = this.reservoir.Name;
      this.addCredentials.max = String(this.reservoir.Max);
      for (let id of this.reservoir.ListOfUsers) {
        this.checkItemState(id)
      }
      this.listOfFiltredUsers = this.listOfUsers;
        console.log(this.listOfUsers);
      localStorage.setItem("users", JSON.stringify(l));
    },
      err => {
        {
          this.showPopup("Error", " failed ,Check internet connection !");
        }
      }
    );
  }
  edit() {
    this.showLoading();
    if (this.addCredentials.name.length < 6)
      this.showPopup("Error", "Reservoir name should contain at list 6 characters ...")
    else {
      this.presentConfirm();
    }
    this.endLoading();
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
    console.log("here");
    var arrayIndex = this.listOfUsers.findIndex(r => r.Id == id);
    if (this.listOfUsers[arrayIndex])
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

            this.auth.EditReservoir(resToCreate, this.reservoir.Id).then(result => {
              this.showPopup("Congratulation", "Reservoir updated successfull");
              this.reservoir.Name = this.addCredentials.name;
              this.reservoir.ListOfUsers = listOfUsers;
              this.reservoir.Max = Number(this.addCredentials.max);

              var reservoirs: Reservoir[] = JSON.parse(localStorage.getItem("reservoirsss"));
              var arrayIndex: number = reservoirs.findIndex(r => r.Id == this.reservoir.Id);
              reservoirs[arrayIndex] = this.reservoir;
              localStorage.removeItem("reservoirsss");
              localStorage.setItem("reservoirsss", JSON.stringify(reservoirs));

              this.navCtrl.push(HomePage);
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
