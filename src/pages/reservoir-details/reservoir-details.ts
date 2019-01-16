import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Loading, LoadingController } from 'ionic-angular';
import { Reservoir } from '../../models/reservoir';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ChangePumpeState } from '../../models/resToChangePumpeState';
import { ReservoirEditPage } from '../reservoir-edit/reservoir-edit';
import { HomePage } from '../home/home';

/**
 * Generated class for the ReservoirDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reservoir-details',
  templateUrl: 'reservoir-details.html',
})
export class ReservoirDetailsPage {
  reservoirs: Reservoir[];
  arrayIndex: number;
  step: number;
  res: Reservoir;
  loading: Loading;

  brightness: number = 20;
  contrast: number = 0;
  level: number;
  structure: any = { lower: 33, upper: 60 };
  text: number = 0;
  isAdminn: boolean;

  constructor(private alertCtrl: AlertController,
    private auth: AuthServiceProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController) {

    this.reservoirs = JSON.parse(localStorage.getItem("reservoirsss"));
    var id = this.navParams.get('id');
    this.arrayIndex = this.reservoirs.findIndex(r => r.Id == id);
    this.initializeItem();
    this.isAdminn = this.auth.isAdmin;
  }
  initializeItem() {
    this.res = this.reservoirs[this.arrayIndex];
    console.log(this.res);
    this.step = this.res.Max / 30.0;
    this.level = this.res.Level;
  }
  get color() {
    var x = this.res.Max / 3;
    if (this.res.Level > 2 * x)
      return "green";
    else if (this.res.Level < x)
      return "danger";
    else
      return "yellow";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReservoirDetailsPage');
  }
  back() {
    localStorage.removeItem("reservoirsss");
    localStorage.setItem("reservoirsss", JSON.stringify(this.reservoirs));
    this.navCtrl.push(HomePage);
  }
  changeRange(valor) {
    console.log(valor.value);
    valor.value = this.res.Level;
  }

  changePumpState() {

    this.presentConfirm();

   
  }
  changeState() {
    this.showLoading();
    var resPumpeState: ChangePumpeState = new ChangePumpeState(this.res.Id, !this.res.PompeState);
    this.auth.ChangePumpeState(resPumpeState).then(result => {
      this.res.PompeState = !this.res.PompeState;
      this.reservoirs[this.arrayIndex].PompeState = this.res.PompeState;
      if (this.res.PompeState)
        this.showPopup("Congratulation", "Pump activated successfully ! ");
      else
        this.showPopup("Congratulation", "Pump disactivated successfully ! ")

    },
      err => {
        {
          this.showPopup("Error", " failed ,Check internet connection !");
          this.showPopup("Error", " failed ,Check internet connection !");
        }
      }
    );
    this.endLoading();
  }
  next() {
    this.arrayIndex = (this.arrayIndex + 1) % this.reservoirs.length;
    this.initializeItem();
  }
  previous() {
    this.arrayIndex = this.arrayIndex - 1;
    if (this.arrayIndex < 0)
      this.arrayIndex = this.reservoirs.length - 1;
    this.initializeItem();
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
  edit() {
    this.navCtrl.push(ReservoirEditPage, { res: this.res });
  }
  presentConfirm() {
    var msg: string;
    if (this.res.PompeState)
      msg = 'Are you sure that you want to disactivate the pump !! '
    else
      msg = 'Are you sure that you want to activate the pump !! '
    let alert = this.alertCtrl.create({
      title: 'Confirm purchase',
      message: msg,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.changeState();
          
          }
        }
      ]
    });
    alert.present();
  }
  delete() {
    this.auth.DeleteReservoir(this.res.Id).then(result => {
      this.showPopup("Congratulation", "Reservoir Deleted successfully !");
      this.reservoirs.splice(this.arrayIndex, 1);
      localStorage.removeItem("reservoirsss");
      localStorage.setItem("reservoirsss", JSON.stringify(this.reservoirs));
      this.arrayIndex = this.arrayIndex % this.reservoirs.length;
      this.res = this.reservoirs[this.arrayIndex];
    },
      err => {
        {
          this.showPopup("Error", " failed ,Check internet connection !");
        }
      }
    );
  }
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }
}
