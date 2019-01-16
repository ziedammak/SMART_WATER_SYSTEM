import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Http, RequestOptions, Headers } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Reservoir } from '../../models/reservoir';
import { ImplicitReceiver } from '@angular/compiler';
import { ReservoirDetailsPage } from '../reservoir-details/reservoir-details';
import { AddReservoirPage } from '../add-reservoir/add-reservoir'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  ngOnInit(): void {
    this.auth.GetAllRes().then(result => {

      var ress: Reservoir[] = []; 
      this.responseData = result
      //console.log(this.responseData);
      for (let res of this.responseData) {
        var reservoir: Reservoir = new Reservoir(res._id, res.Name, res.Max, res.Level, res.State, res.ListOfUsers);
        ress.push(reservoir);
      }
      //console.log(JSON.stringify(ress));
      this.reservoirs = ress;
      console.log(this.reservoirs);
      localStorage.setItem("reservoirsss", JSON.stringify(ress));
    },
      err => {
        {
          this.showPopup("Error", " failed ,Check internet connection !");
        }
      }
    );
    }

  users;
  private isOn: boolean;
  private reservoirs: Reservoir[] = [];
  loading: Loading;
  private responseData: any;
  private isAdminn: boolean;

  constructor(private alertCtrl: AlertController, private nav: NavController, private auth: AuthServiceProvider, public http: Http, private loadingCtrl: LoadingController) {
    // this.getUsers();
    this.isOn = false;
    //this.initializeItems();
    this.isAdminn = this.auth.isAdmin;
  }

  public logout() {
    this.auth.logout().subscribe(succ => {
      localStorage.clear();
      this.nav.setRoot('LoginPage')
     
    });
  }
  public toggleDetails() {
    this.isOn = !this.isOn;
    this.initializeItems();
  }

  public iconColor(reservoir: Reservoir) {
    var x = reservoir.Max / 3;
    if (reservoir.Level > 2 * x)
      return "green";
    else if (reservoir.Level < x)
      return "danger";
    else
      return "yellow";
  }
  initializeItems() {
    this.reservoirs = JSON.parse(localStorage.getItem("reservoirsss"));
  }
  getItems(ev: any) {

    this.initializeItems();
  
    const val = ev.target.value;
   
    if (val && val.trim() != '') {
      this.reservoirs = this.reservoirs.filter((item) => {
        return (item.Name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  reservoirDetails(id: any) {
    this.nav.push(ReservoirDetailsPage, { id: id });
  }
  refresh() {
    this.showLoading();
    this.auth.GetAllRes().then(result => {
      var ress: Reservoir[] = [];
      this.responseData = result
      //console.log(this.responseData);
      for (let res of this.responseData) {
        var reservoir: Reservoir = new Reservoir(res._id, res.Name, res.Max, res.Level, res.State, res.ListOfUsers);
        ress.push(reservoir);
        console.log(res);
      }
      //console.log(JSON.stringify(ress));
      this.reservoirs = ress;
      localStorage.removeItem("reservoirsss");
      localStorage.setItem("reservoirsss", JSON.stringify(ress));
    },
      err => {
        {
          this.showPopup("Error", " failed ,Check internet connection !");
        }
      }
    );
    this.endLoading();
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
  add() {
    this.nav.push(AddReservoirPage);
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
  get isAdmin() {
    return Number( localStorage.getItem("permission")) > 2;
  }
}
