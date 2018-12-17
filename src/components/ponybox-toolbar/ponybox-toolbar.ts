import { Component } from '@angular/core';
import { NavController, ModalController, AlertController } from 'ionic-angular';

import { LoginPage } from '../../pages/login/login';
import { HelpPage } from '../../pages/help/help';
import { UsersListPage } from '../../pages/users-list/users-list';
import { ChannelsListPage } from '../../pages/channels-list/channels-list';

import { PonyboxService } from '../../services/ponybox'
import { ObserverService } from '../../services/observer';

/**
 * Generated class for the PonyboxToolbarComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'ponybox-toolbar',
  templateUrl: 'ponybox-toolbar.html'
})
export class PonyboxToolbarComponent {
    public showNewMessage: boolean = false;
    private timeout: any = null;
    
    constructor(
        private navCtrl : NavController,
        private ponyboxService : PonyboxService,
        private modalCtrl : ModalController,
        private observerService : ObserverService,
        private alertCtrl : AlertController
    ) {
        this.observerService.observe('new-message-other-channel').subscribe(() => {
            clearTimeout(this.timeout);
            this.showNewMessage = true;
            this.timeout = setTimeout(() => {
                this.showNewMessage = false;
            }, 5000);
        });
    }
    
    showHelp() {
        let helpModal = this.modalCtrl.create(HelpPage, null, {cssClass : 'night-theme'});
        helpModal.present();
    }
    
    showUsersList() {
        this.navCtrl.push(UsersListPage);
    }
    
    showChannelsList() {
        this.navCtrl.push(ChannelsListPage);
    }
    
    logout() {
        let alert = this.alertCtrl.create({
            title: 'Deconnexion',
            message: 'Voulez vous vous déconnecter ?',
            buttons: [
                {
                    text: 'Annuler',
                    role: 'cancel'
                },
                {
                    text: 'Déconnexion',
                    handler: () => {
                        this.ponyboxService.logout();
                        this.navCtrl.setRoot(LoginPage);
                    }
                }
            ]
        });
        alert.present();
    }

}
