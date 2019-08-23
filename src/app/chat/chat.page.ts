import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {TjommisHubService, HangoutEventMessage, Message} from "../services/tjommis-hub.service";
import {Events, IonContent} from "@ionic/angular";
import { routerNgProbeToken } from'@angular/router/src/router_module';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  message: string;
  public messages: Message[] = this.tjommisHub.activeRoom.messages;

  constructor(
      public router: Router,
      public tjommisHub: TjommisHubService,
      public events: Events,
      private zone: NgZone

  ) {
    events.subscribe("message",(lobby: string, message: Message) => {
      console.log("Chat message received:" , lobby, message);
      this.onAddMessage();
    });
  }

  messageIsSelf(msg : Message) {
      return msg.user.toLowerCase() == this.tjommisHub.connectionInfo.userInfo.username.toLowerCase();
  }

  private onAddMessage = () => {
    // Update messages
    this.zone.run(() => {
      this.messages = this.tjommisHub.activeRoom.messages;
      this.content.scrollToBottom();
    })
  };

  handleSendMessage() {
    this.tjommisHub.SendMessage(this.message);
    this.message = "";
  }

  ngOnInit() {
    if (this.tjommisHub.getConnectionState() == 0) this.router.navigateByUrl('/login');
  }


}
