import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

import { UsersListPage } from '../users-list/users-list';
import { ChannelsListPage } from '../channels-list/channels-list';

import { PonyboxService } from '../../services/ponybox';
import { CurrentUser } from '../../services/current-user';
import { Auth } from '../../services/auth';

import { ServerInterface } from '../../services/server-interface';

import { LoginPage } from '../../pages/login/login';

/**
 * Generated class for the PonyboxPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-ponybox',
  templateUrl: 'ponybox.html',
})
export class PonyboxPage {
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public ponyboxService : PonyboxService,
        public currentUser : CurrentUser,
        private nativeTransition : NativePageTransitions,
        private serverInterface : ServerInterface,
        private alertCtrl : AlertController,
        private auth : Auth
    ) {
        this.serverInterface.observeDisconnect().subscribe(() => {
            this.ponyboxService.logout();
            let alert = this.alertCtrl.create({
                title: 'Oups !',
                message: 'Vous avez été déconnecté de la ChatBox',
                buttons: [
                    {
                        text: 'Deconnexion',
                        handler: () => {
                            this.navCtrl.setRoot(LoginPage);
                        }
                    },
                    {
                        text: 'Reconnexion',
                        handler: () => {
                            this.auth.autoConnect().then((data) => {
                                if (data === false) {
                                    let alert = this.alertCtrl.create({
                                        title: 'Erreur de connexion',
                                        message: 'La connexion automatique a échoué, vous allez être redirigé vers la page de connexion',
                                        buttons: [
                                            {
                                                text: 'OK',
                                                handler: () => {
                                                    this.navCtrl.setRoot(LoginPage);
                                                }
                                            }
                                        ]
                                    });
                                    alert.present();
                                }
                            });
                        }
                    }
                ]
              });
            alert.present();
        });
    }
    
    swipeEvent(event: any) {
        let options: NativeTransitionOptions = {
            direction: 'left',
            duration: 500,
            slowdownfactor: 3,
            slidePixels: 20,
            iosdelay: 100,
            androiddelay: 150,
            fixedPixelsTop: 0,
            fixedPixelsBottom: 60
        };
        if (event.direction === 2) { // droite
            options.direction = 'left';
            
            this.nativeTransition.slide(options);
            this.navCtrl.push(UsersListPage);
            
        } else if (event.direction === 4) { //gauche
            options.direction = 'right';
            
            this.nativeTransition.slide(options);
            this.navCtrl.push(ChannelsListPage);
        }
    }
}
