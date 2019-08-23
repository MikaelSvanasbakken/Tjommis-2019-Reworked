import { Injectable } from '@angular/core';
import {HubConnection, HubConnectionBuilder, HubConnectionState} from '@aspnet/signalr';
import {Events} from '@ionic/angular';
import {AuthServiceService} from "../services/auth-service.service";
import { connect } from 'tls';

@Injectable({
  providedIn: 'root'
})

export class TjommisHubService {
    private hubConnection: HubConnection;
    //public username: string;
    public connectionInfo : ConnectionInfo; 
    public connectedusers: number;
    public randomNumber: number;
    public authenticated: boolean;
    public messages: string[] = ['system message'];
    public rooms: Lobby[] = [];
    public activeRoom: Lobby;
    public connected = this.hubConnection != null ? this.hubConnection.state == HubConnectionState.Connected : false;
    public getConnectionState() {
        return this.hubConnection != null ? this.hubConnection.state : 0;
    }
    //public state : HubConnectionState = this.hubConnection == null ? 2 : this.hubConnection.state;

    constructor(public events: Events,
        public authService: AuthServiceService,) {}

    enterLobby(lobby: Lobby) {
        console.log("TjommisHub: Entering lobby:",lobby);
        this.hubConnection.send("EnterLobby",this.connectionInfo.userInfo, lobby);
    } 
    SendMessage(message) {
        this.hubConnection.send('SendMessage',this.activeRoom.lobbyName,message);
    }
    HangoutGroup()  {
        console.log("Request Hangout: Group");
        return this.hubConnection.invoke('HangoutGroup');
    }
    HangoutSingle()  {
        console.log("Request Hangout: Single")
        return this.hubConnection.invoke('HangoutSingle');
    }

    updateInterests(interestList : string[]) : boolean {
        console.log("updating interests:", interestList);
        this.hubConnection.invoke("UpdateInterests",interestList).then(r=> {
            console.log("Response",r);
            if (r != null) {
                this.connectionInfo = r;
                this.events.publish("updateinterests");
                return true;
            }
        }).catch(err => {
            console.log("UpdateInterests failed", err);
            return false;
        });
        console.log("Update interest function complete.");
        return false;
    }
    // Connect method for SignalR
    // Returns: Promise(resolve, reject")
    connect(accesstoken) {
        return new Promise((resolve, reject) => {
            // If allready connected from earlier sessions, disconnect and reconnect
            if (this.hubConnection != null) { this.hubConnection.stop(); }

            console.log(accesstoken);
            // Create a new hub and connect it using accessToken from earlier
            this.hubConnection = new HubConnectionBuilder()
            .withUrl(this.authService.endPoint + this.authService.hubEndPoint,{accessTokenFactory: () => accesstoken})
             .build();

            // Register the callback functions (Maybe do this on component load)
            // Possibly let the components register the events directly to SignalR themselves,
            // for now we are using ionics Event system
            this.registerSignalRCallbacks(this.hubConnection);

            // Start connect and return value
            this.hubConnection
                .start()
                .then(() => resolve(true))
                .catch(() => reject('Error while establishing connection :('));
                
            setInterval(() => this.reconnect(),5000);
        });
    }
    reconnect() {
        
            console.log("Monitoring connection...");
            // If allready connected from earlier sessions, disconnect and reconnect
            if (this.hubConnection != null) {
                if (this.getConnectionState() == 1) { return; }
                this.hubConnection.stop(); 
            }

            // Create a new hub and connect it using accessToken from earlier
            this.hubConnection = new HubConnectionBuilder().
             withUrl(this.authService.endPoint + this.authService.hubEndPoint,{accessTokenFactory: () => this.authService.loginToken})
             .build();

            // Register the callback functions (Maybe do this on component load)
            // Possibly let the components register the events directly to SignalR themselves,
            // for now we are using ionics Event system
            this.registerSignalRCallbacks(this.hubConnection);

            // Start connect and return value
            this.hubConnection
                .start()
                .then(() => console.log("connected"))
                .catch(() => console.log('Error while establishing connection :('));

    }
    registerSignalRCallbacks(hubConnection) {
        
        hubConnection.on('messageBroadcastEvent', (user: string, message: string) => {
            const fullmessage = user + '> ' + message;
            this.messages.push(fullmessage);
            this.events.publish('message', fullmessage);
            console.log('message: ', message, 'user:', user);
        });
        hubConnection.on('infoConnectEvent', (connectioninfo: ConnectionInfo) => {
            console.log('infoConnectEvent', connectioninfo);
            this.connectionInfo = connectioninfo;
            this.rooms = connectioninfo.userInfo.lobbies;
            this.events.publish('username', connectioninfo.userInfo.username);
        });
        hubConnection.on('infoGlobalEvent', (connectedusers: number) => {
            console.log('connectedusers:', connectedusers);
        });
        
        hubConnection.on('message', (lobby: string, message: Message) => {
            console.log('Message',lobby, message);
            if (this.activeRoom.lobbyName == lobby) this.activeRoom.messages.push(message);
            this.events.publish('message',lobby,message);
        });
        
        hubConnection.on('enterroom',(room: Lobby) => {
            console.log("Joining room: ", room);
            this.activeRoom = room;
            this.events.publish('joinroom',room);
        });
        hubConnection.on('joinroom',(room: Lobby) => {
            console.log("Joining room: ", room);
            this.rooms.push(room);
            this.activeRoom = room;
            this.events.publish('joinroom',room);
        });
        hubConnection.on('userjoin',(user: ExternalUser, lobby : Lobby) => {
            this.events.publish('userjoin',user,lobby);
        });
        hubConnection.on('lobbyinfo',(room: Lobby) => {
            this.events.publish('lobbyinfo',room);
        });
        hubConnection.on('hangoutevent',(eventArgs : HangoutEventMessage) => {
            this.events.publish('hangoutevent',eventArgs);
        });
    }
}
export class User {
    username : string;
    interests : string[];
    lobbies : Lobby[];
}
export class InterestItem {
    id : number;
    category : string;
    name : string;
}
export class ConnectionInfo {
    userInfo : User;
    interestList : InterestItem[];

}
export class ExternalUser {
    username : string;
    lastname : string;
}
export class Message {
    type : string;
    user : string;
    text: string;
    timestamp : Date;
}
export class Lobby {
    public lobbyName : string;
    public members : ExternalUser[];
    public messages : Message[];
}

export class HangoutEventMessage {
    public room: Lobby;
    public timeStamp : Date;
    public totalUsers : number;
    public timeRunning: number;
}
