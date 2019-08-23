import { Component, NgZone, OnInit } from '@angular/core';
import { AuthServiceService } from "../services/auth-service.service";
import { TjommisHubService } from "../services/tjommis-hub.service";
import { ToastController } from '@ionic/angular';
import { Router } from "@angular/router";

@Component({
  selector: 'app-registrate',
  templateUrl: './registrate.page.html',
  styleUrls: ['./registrate.page.scss'],
})
export class RegistratePage implements OnInit {
  public statusMessage: string = "";
  //displayError: boolean = false;

  username: string = "";
  lastName: string = "";
  password: string = "";
  email: string = "";
  Institutt: string[] = ["Kristiania", "UiO", "BI"];
  selectedInstitutt: string;
  Studie: string[] = ["E-business","Frontend- og mobilutvikling", "Interaktivt design", "Intellingente systemer", "Programmering", "Spillprogrammering"];
  selectedStudie: string;

  isPosting : boolean = false;

  constructor(
    public router: Router,
    public authService: AuthServiceService,
    public tjommisHub: TjommisHubService,
    public toastController: ToastController) {

  }

  ngOnInit() {
  }

  async displayError(errormessage: string) {
    const toast = await this.toastController.create({
      message: errormessage,
      duration: 2000
    });
    toast.present();
  }
  

  register() {
    this.isPosting = true;
    let newUser = {
      name: this.username,
      lastname: this.lastName,
      password: this.password,
      email: this.email,
      Institutt: this.selectedInstitutt,
      Studie: this.selectedStudie
    };
    console.log("Creating user",newUser);

    fetch(this.authService.endPoint + '/api/RegisterUser', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
      .then(regResponse => {
        if (regResponse.status == 400) {
          regResponse.text().then(txt => {
            this.displayError(txt);
            this.isPosting = false;
          })
          return;
        };
        //Sign in metode fra authservice
        this.authService.login({ username: this.username, password: this.password })
          .then(response => {
            this.statusMessage = "Logging inn...";
            this.tjommisHub.connect(this.authService.loginToken).then(
              () => {
                this.statusMessage = "";
                this.router.navigateByUrl('/profile');
              },
              rejected => {
                console.log("Could not connect: ", rejected)
              }
            );
          },
            rejectedResponse => {
              console.log("Rejected:", rejectedResponse);
              this.displayError("Failed to logon");
              this.isPosting = false;
              this.statusMessage = rejectedResponse;
            });

      })
      .catch(err => {
        console.log(err);
        this.displayError("Could not create user");
        this.isPosting = false;
      });
  }

}




