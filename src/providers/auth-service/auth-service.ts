import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { RefreshToken } from '../../models/refreshToken';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {

 
  static readonly LOGIN_URL = 'https://ziedmalek.localtunnel.me/auth';
  
  static readonly REGISTER_URL = 'https://ziedmalek.localtunnel.me/users';

  static readonly GETALLUSER_URL = 'https://ziedmalek.localtunnel.me/users';

  static readonly CREATERES_URL = 'https://ziedmalek.localtunnel.me/reservs';

  static readonly GETTALLRES = 'https://ziedmalek.localtunnel.me/getreservs';

  static readonly CHANGEPUMPUSTATE = 'https://ziedmalek.localtunnel.me/changePumpeState';
  
  static readonly EDITRES = 'https://ziedmalek.localtunnel.me/EditReservoir/';

  static readonly DELETERES = 'https://ziedmalek.localtunnel.me/DeleteReservoir/';

  static readonly REFRESHTOKEN = 'https://ziedmalek.localtunnel.me//auth/refresh'
  access: boolean;
  token: string;
  resposeData: any;
  accessToken: string;

  constructor(public http: Http) {}

  // Login
  public login(credentials) {
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.http.post( AuthServiceProvider.LOGIN_URL, JSON.stringify(credentials), { headers: headers }).
          subscribe(res => {
            resolve(res.json());
          }, (err) => {
            if (err.statusText == "Unauthorized") {
              resolve(err);
            }
            else {
              reject(err);
            }
          });

      });
  }

  // Register
  public register(credentials) {
      return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.http.post(AuthServiceProvider.REGISTER_URL, JSON.stringify(credentials), { headers: headers }).
          subscribe(res => {
            resolve(res.json());
          }, (err) => {
            if (err.statusText == "Unauthorized") {
              resolve(err);
            }
            else {
              reject(err);
            }
          });
      });
  }

  //Get All users
  public GetAllUsers() {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      if (this.isTokenExpired()) {
        this.refreshToken().then(token => {
          this.resposeData = token;
          if (token) {
            localStorage.setItem("userToken", this.resposeData.access_token);
            this.accessToken = this.resposeData.access_token;
            console.log(this.resposeData);
            this.setExpiredTokenTime(Number(localStorage.getItem("s")));
            console.log(token);
          }
          else {
            this.accessToken = this.getToken();
            console.log(this.resposeData)
          }
        })
      }
      else
        this.accessToken = this.getToken();
      headers.append('Authorization', 'Bearer ' + this.accessToken);
      this.http.get(AuthServiceProvider.GETALLUSER_URL, { headers: headers }).
        subscribe(res => {
          resolve(res.json());
        }, (err) => {
          if (err.statusText == "Unauthorized") {
            resolve(err);
          }
          else {
            reject(err);
          }
        });

    });
  }

  //Create Res 

  public CreateRes(ResWithUsers: any) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      if (this.isTokenExpired()) {
        this.refreshToken().then(token => {
          this.resposeData = token;
          if (token) {
            localStorage.setItem("userToken", this.resposeData.access_token);
            this.accessToken = this.resposeData.access_token;
            console.log(this.resposeData);
            this.setExpiredTokenTime(Number(localStorage.getItem("s")));
            console.log(token);
          }
          else {
            this.accessToken = this.getToken();
            console.log(this.resposeData)
          }
        })
      }
      else
        this.accessToken = this.getToken();
      headers.append('Authorization', 'Bearer ' + this.accessToken);
      this.http.post(AuthServiceProvider.CREATERES_URL, JSON.stringify(ResWithUsers), { headers: headers }).
        subscribe(res => {
          resolve(res.json());
        }, (err) => {
          if (err.statusText == "Unauthorized") {
            resolve(err);
          }
          else {
            reject(err);
          }
        });

    });
  }

  // Get Reservoirs 
  public GetAllRes() {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      if (this.isTokenExpired()) {
        this.refreshToken().then(token => {
          this.resposeData = token;
          if (token) {
            localStorage.setItem("userToken", this.resposeData.access_token);
            this.accessToken = this.resposeData.access_token;
            console.log(this.resposeData);
            this.setExpiredTokenTime(Number(localStorage.getItem("s")));
            console.log(token);
          }
          else {
            this.accessToken = this.getToken();
            console.log(this.resposeData)
          }
        })
      }
      else
        this.accessToken = this.getToken();

      headers.append('Authorization', 'Bearer ' + this.accessToken);
      this.http.get(AuthServiceProvider.GETTALLRES, { headers: headers }).
        subscribe(res => {
          console.log("i am here");
          resolve(res.json());
         
        }, (err) => {
          if (err.statusText == "Unauthorized") {
            resolve(err);
          }
          else {
            reject(err);
          }
        });

    });
  }
  public refreshToken() {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer ' + this.getToken());
      console.log(JSON.stringify(new RefreshToken(localStorage.getItem("refreshToken"))))
      this.http.post(AuthServiceProvider.REFRESHTOKEN, JSON.stringify(new RefreshToken(localStorage.getItem("refreshToken"))), { headers: headers }).
        subscribe(res => {
          resolve(res.json());
        }, (err) => {
          if (err.statusText == "Unauthorized") {
            resolve(err);
          }
          else {
            reject(err);
          }
        });

    });
    

  }
  // change pumpe state
  public ChangePumpeState(ResWithPumpeState: any) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      if (this.isTokenExpired()) {
        this.refreshToken().then(token => {
          this.resposeData = token;
          if (token) {
            localStorage.setItem("userToken", this.resposeData.access_token);
            this.accessToken = this.resposeData.access_token;
            console.log(this.resposeData);
            this.setExpiredTokenTime(Number(localStorage.getItem("s")));
            console.log(token);
          }
          else {
            this.accessToken = this.getToken();
            console.log(this.resposeData)
          }
        })
      }
      else
        this.accessToken = this.getToken();
      headers.append('Authorization', 'Bearer ' + this.accessToken);
      this.http.post(AuthServiceProvider.CHANGEPUMPUSTATE, JSON.stringify(ResWithPumpeState), { headers: headers }).
        subscribe(res => {
          resolve(res.json());
        }, (err) => {
          if (err.statusText == "Unauthorized") {
            resolve(err);
          }
          else {
            reject(err);
          }
        });

    });
  }

  // Edit reservoir 
  public EditReservoir(ResWithUsers: any, id: string) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      if (this.isTokenExpired()) {
        this.refreshToken().then(token => {
          this.resposeData = token;
          if (token) {
            localStorage.setItem("userToken", this.resposeData.access_token);
            this.accessToken = this.resposeData.access_token;
            console.log(this.resposeData);
            this.setExpiredTokenTime(Number(localStorage.getItem("s")));
            console.log(token);
          }
          else {
            this.accessToken = this.getToken();
            console.log(this.resposeData)
          }
        })
      }
      else
        this.accessToken = this.getToken();
      headers.append('Authorization', 'Bearer ' + this.accessToken);
      this.http.post(AuthServiceProvider.EDITRES + id, JSON.stringify(ResWithUsers), { headers: headers }).
        subscribe(res => {
          resolve(res.json());
        }, (err) => {
          if (err.statusText == "Unauthorized") {
            resolve(err);
          }
          else {
            reject(err);
          }
        });

    });
  }

  // Delete reservoir
  public DeleteReservoir(id: string) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      if (this.isTokenExpired()) {
        this.refreshToken().then(token => {
          this.resposeData = token;
          if (token) {
            localStorage.setItem("userToken", this.resposeData.access_token);
            this.accessToken = this.resposeData.access_token;
            console.log(this.resposeData);
            this.setExpiredTokenTime(Number(localStorage.getItem("s")));
            console.log(token);
          }
          else {
            this.accessToken = this.getToken();
            console.log(this.resposeData)
          }
        })
      }
      else
        this.accessToken = this.getToken();
      headers.append('Authorization', 'Bearer ' + this.accessToken);
      this.http.get(AuthServiceProvider.DELETERES + id, { headers: headers }).
        subscribe(res => {
          console.log("i am here");
          resolve(res.json());

        }, (err) => {
          if (err.statusText == "Unauthorized") {
            resolve(err);
          }
          else {
            reject(err);
          }
        });

    });
  }
  // Get Token
  public getToken() {
    return localStorage.getItem("userToken");
  }

  // Logout
  public logout() {
    return Observable.create(observer => {
      observer.next(true);
      observer.complete();
    });
  }
  get isAdmin() {
    return Number(localStorage.getItem("permission")) > 2;
  }
  public setExpiredTokenTime(s) {
    var timeNow = new Date().getTime();
    localStorage.setItem("ExpiredTime", JSON.stringify(timeNow + (s * 1000)))
    localStorage.setItem("s", s);
  }
  public isTokenExpired() {
    var timeNow = new Date().getTime();
    console.log(Math.abs(((timeNow - Number(localStorage.getItem("ExpiredTime"))))))
    console.log(Number(localStorage.getItem("s")) * 1000 / 3);
    var x: boolean = Math.abs(((timeNow - Number(localStorage.getItem("ExpiredTime"))))) < Number(localStorage.getItem("s")) * 1000 / 3;
    return x;
    //return true; 
  }
}
