import { Injectable } from '@angular/core';
import {HttpHeaders} from "@angular/common/http";
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {  
    public endPoint : string = "https://smidigprosjekt.azurewebsites.net";
    public tokenUrl = this.endPoint + '/token';
    public hubEndPoint = '/tjommisHub';
    //public tokenUrl = this.endPoint + '/developer_token';
    //public hubEndPoint = 'https://localhost:5001/tjommisHub';//'/tjommisHub';
    public loginToken: string;
    constructor(public http: HttpClient) {}


    login(credentials) {
        return new Promise((resolve, reject) => {
            const  headers = new  HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
            let loginData = "username=" + credentials.username +
             "&password=" + encodeURIComponent(credentials.password) +
             "&grant_type=password&client_id=tjommisdemo2018_signing_key_that_should_be_very_long";
            this.http
            .post<any>(this.tokenUrl, loginData,{headers, responseType: 'json'})
            .subscribe(res => {
                if (res.access_token) {
                    console.log("Token received: ", res);
                    this.loginToken = res.access_token;
                    return resolve(this.loginToken);

                } else {
                    console.log('Unknown error', res);
                    return reject(res.error);
                }
            }, (err) => {
                console.log("Post error: ",err);
                return reject(err.statusText);
            });
        });
    }

    logout() {
        return new Promise((resolve, reject) => {
            const headers = new HttpHeaders().set('X-Auth-Token', localStorage.getItem('token'));
            this.http.post(this.loginToken + '/logout', {}, {headers})
                .subscribe(res => {
                    localStorage.clear();
                }, (err) => {
                    reject(err);
                });
        });
    }
}
