
import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {Events, IonContent} from "@ionic/angular";
import {Lobby, TjommisHubService} from "../services/tjommis-hub.service";
import anime from 'animejs';
import { InteresserPage } from '../interesser/interesser.page';


@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
    @ViewChild(IonContent) content: IonContent;
    constructor(
        public router: Router,
        public tjommisHub: TjommisHubService,
        public events: Events,
        private zone: NgZone) {

        this.events.subscribe('connectedusers', (data) => {
            this.onUpdateConnectedUsers(data);

        });
        this.events.subscribe('username', (data) => {
            console.log("Profile.OnUpdateUserName", data);
            this.onUpdateUsername(data);
        });
        this.events.subscribe('joinroom', (data) => {
            console.log("Joining room from profile..", data);
            this.router.navigateByUrl('/chat');
        });

        this.events.subscribe('updateinterests', (data) => {
            console.log("Profile.OnUpdateUserName", data);
            //this.onUpdateInterests(data);
        });
    }

    lobbies: Lobby[] = this.tjommisHub.rooms ? this.tjommisHub.rooms : [];
    username: string = this.tjommisHub.connectionInfo ? this.tjommisHub.connectionInfo.userInfo.username : null;
    connectedUsers: number = 0;

    myinterests: string[] = this.tjommisHub.connectionInfo.userInfo ? this.tjommisHub.connectionInfo.userInfo.interests : [];


    joinLobby = (lobby : Lobby) => {
        this.tjommisHub.enterLobby(lobby);
    };
    onUpdateConnectedUsers = number => {
        this.zone.run(() => {
            this.connectedUsers = number;
            console.log("connected users: ", number)
        });
    };

    onUpdateUsername = username => {
        this.zone.run(() => {
            this.username = username;

        });
    };

    onUpdateInterests = () => {
        this.zone.run(() => {
            this.myinterests = this.tjommisHub.connectionInfo.userInfo.interests;
        });
    };


    ngOnInit() {
        if (this.tjommisHub.getConnectionState() == 0) {
            this.router.navigateByUrl("/login");
        }
    }
    interesser() {
        this.router.navigateByUrl('/interesser')
    }

    chatGroup() {
        this.tjommisHub.HangoutGroup().then(e => {
            if (e) this.router.navigateByUrl('/loading');
        }).catch(e => {
            /* Todo: SnackBar feilmelding til bruker */
            console.log("Hangout failed: ", e);
        });
    }
    chatSingle() {
        this.tjommisHub.HangoutSingle().then(e => {
            if (e) this.router.navigateByUrl('/loading');
        }).catch(e => {
            /* Todo: SnackBar feilmelding til bruker */
            console.log("Hangout failed: ", e);
        });
    }

    sanitateName(name) {
        let splittedLobbyName = name.split('-');
        let sanitatedName = "" + splittedLobbyName[0] + " " + splittedLobbyName[1];

        return sanitatedName;
    }


    animateClick() {
        anime({
            targets: 'chatWrapper',
            translateY: '10vh',
            duration: 300,
            direction: 'alternate',
            easing: 'easeInCubic',
            scaleX: {
                value: 1.05,
                duration: 150,
                delay: 268
            },
            complete: () => {
                this.chatSingle()
            }
        });
    }


}