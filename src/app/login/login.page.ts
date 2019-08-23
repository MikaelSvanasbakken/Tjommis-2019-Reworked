import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TjommisHubService} from "../services/tjommis-hub.service";
import {AuthServiceService} from "../services/auth-service.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    public statusMessage: string = "";
    displayError: boolean = false;
    public loginFormGroup: FormGroup;
    submitAttempt: boolean = false;
    username: string = "";
    password: string = "";
    errorMessage: string = "";


    constructor(public router: Router,
                public authService: AuthServiceService,
                public tjommisHub: TjommisHubService,
                public formBuilder: FormBuilder,) {

        this.loginFormGroup = formBuilder.group({
            username: ['',Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z0-9]*'), Validators.required])],
            password: ['',Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z0-9]*'), Validators.required])],
            affiliation:['']
        })
    }
    ngOnInit() {
    }
    
    register() {
        this.router.navigateByUrl('/registrate');
    }

    login(){
        this.displayError = false;
        this.submitAttempt = true;
        if (!this.loginFormGroup.valid) {
            this.errorMessage = "Please fill out all the form input correctly.";
            return;
        }

        this.statusMessage = "Authenticating...";

        //need to pass this value somehow
        //let affiliation = this.loginFormGroup.controls["affiliation"].value;
        this.authService.login({username: this.loginFormGroup.controls["username"].value, password: this.loginFormGroup.controls["password"].value})
            .then(response=> {
                    this.statusMessage = "Logging in...";
                    this.tjommisHub.connect(this.authService.loginToken).then(
                        () => {
                            this.statusMessage = "";
                            this.router.navigateByUrl('/profile');
                        },
                        rejected => {
                            console.log("Could not connect: " ,rejected)
                        }
                    );
                },
                rejectedResponse => {
                    console.log("Rejected:", rejectedResponse);
                    this.statusMessage = "";
                    this.displayError = true;
                    this.errorMessage = rejectedResponse;
                });
        //this.navCtrl.push(MainPage)
    }

}
