import { Injectable } from '@angular/core';

import { ApiProvider } from '../providers/api';
import { CurrentUser } from './current-user';
import { Storage } from '@ionic/storage';
import { ServerInterface } from './server-interface';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class Auth {
    
    constructor(
        private loadingCtrl : LoadingController,
        private api: ApiProvider,
        private currentUser : CurrentUser,
        private storage: Storage,
        private serverInterface : ServerInterface,
    ) {
        
    }
    
    login(username: string, password: string) {
        return new Promise((resolve) => {
            this.api.login(username, password).then((data: any) => {
                resolve(data);
            });
        });
    }
    
    autoConnect() {
        return new Promise((resolve) => {
            this.storage.get('user').then((val) => {
                if (val !== null) {
                    this.connect(val.user, val.token).then((val: any) => {
                        resolve(val.valid);
                    });
                } else {
                    resolve(false);
                }
            });
        })
    }
   
    connect(user: number, token: string) {
        return new Promise((resolve) => {
            let loading = this.loadingCtrl.create({content : 'Connexion en cours'});
            loading.present();
            this.serverInterface.connectUser(user, token).then((val : any) => {
                if (val.valid === true) {
                    this.storage.set('user', {user: user, token: token});
                    this.currentUser.createFromData(val.user);
                }
                loading.dismiss();
                resolve(val);
            });
        })
    }
   
   logout() {
       this.currentUser.logout();
       this.storage.remove('user');
       this.serverInterface.disconnectUser();
   }
}