import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { PonyboxService } from '../services/ponybox';
import { ServerInterface } from '../services/server-interface';

import { LoginPage } from '../pages/login/login';
import { PonyboxPage } from '../pages/ponybox/ponybox';


import { Auth } from '../services/auth';
import { SocketServer } from '../services/socket-server';
import { Ponybox } from '../class/ponybox';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    
    rootPage:any = LoginPage;

    constructor(
        platform: Platform,
        statusBar: StatusBar,
        splashScreen: SplashScreen,
        private auth: Auth,
        private socketService : SocketServer,
        ponyboxService : PonyboxService,
        serverInterface : ServerInterface
    ) {
        this.socketService.connect();
        ponyboxService.ponybox = new Ponybox();
        serverInterface.ponybox = ponyboxService.ponybox;
        platform.ready().then(() => {
            statusBar.styleLightContent();
            this.initialize().then(() => {
                splashScreen.hide();
            });
        });
    }
    
    initialize() {
        return new Promise((resolve) => {
            // On commence par tenter une connexion automatique
            this.auth.autoConnect().then((success) => {
                // Si la connexion auto a échoué, alors on laisse la page de connexion affiché
                // Sinon on redirige sur la CB
                if (success === true) {
                    this.nav.setRoot(PonyboxPage);
                }
                resolve();
            });
        });
    }
}

