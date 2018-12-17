import { Component, Input } from '@angular/core';
import { LoadingController, AlertController  } from 'ionic-angular';

import { Message } from '../../class/message';
import { User } from '../../class/user';

import { CurrentUser } from '../../services/current-user';
import { ServerInterface } from '../../services/server-interface';
import { PonyboxService } from '../../services/ponybox';
import { ObserverService } from '../../services/observer';

/**
 * Generated class for the MessageComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'message-component',
  templateUrl: 'message.html'
})
export class MessageComponent {
    @Input() message: Message;
    private senderSeen: User = null;
    
    constructor(
        private currentUser : CurrentUser,
        private loadingCtrl : LoadingController,
        private alertCtrl : AlertController,
        private serverInterface : ServerInterface,
        private ponyboxService : PonyboxService,
        private observerService : ObserverService
    ) {
    
    }
    
    getShowedSender() {
        if (this.senderSeen !== null) return this.senderSeen;
        this.senderSeen = this.message.sender;
        if (this.message.isPrivate()) {
            if (this.message.sender.id === this.currentUser.user.id) {
                this.senderSeen = this.message.to;
            }
        }
    }
    
    getMessageDateFormat() {
        let hours = '' + this.message.date.getHours() + '';
        if (this.message.date.getHours() <= 9) {
            hours = '0' + hours;
        }
        let minutes = '' + this.message.date.getMinutes() + '';
        if (this.message.date.getMinutes() <= 9) {
            minutes = '0' + minutes;
        }
        
        return hours + ':' + minutes;
    }

    editMessage() {
        let loading = this.loadingCtrl.create();
        loading.present();
        this.serverInterface.getOriginalMessage(this.message).then((message: string) => {
            loading.dismiss();
            if (message === null) return;
            let alert = this.alertCtrl.create({
                title: 'Edition de message',
                cssClass : 'night-theme',
                inputs: [
                    {
                      name: 'message',
                      placeholder: 'Message',
                      value : message
                    },
                ],
                buttons: [
                    {
                        text: 'Annuler',
                        role: 'cancel',
                    },
                    {
                        text: 'Editer',
                        handler: data => {
                            this.confirmEditMessage(data.message);
                        }
                    }
                ]
            });
            alert.present();
        });
    }
    
    clickUser() {
        let user = this.getShowedSender();
        this.observerService.emit('click-user', user);
    }
    
    confirmEditMessage(newMessage: string) {
        if (newMessage.length === 0) return;
        this.ponyboxService.editMessage(this.message, newMessage);
    }
}
