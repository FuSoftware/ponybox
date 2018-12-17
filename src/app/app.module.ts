import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, isDevMode } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { NativePageTransitions } from '@ionic-native/native-page-transitions';

import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { PonyboxPage } from '../pages/ponybox/ponybox';
import { HelpPage } from '../pages/help/help';
import { UsersListPage } from '../pages/users-list/users-list';
import { ChannelsListPage } from '../pages/channels-list/channels-list';

import { FormMessageComponent } from '../components/form-message/form-message';
import { MessageComponent } from '../components/message/message';
import { ChannelComponent } from '../components/channel/channel';
import { PonyboxToolbarComponent } from '../components/ponybox-toolbar/ponybox-toolbar';

import { ApiProvider } from '../providers/api';

import { Auth            } from '../services/auth';
import { Config          } from '../services/config';
import { CurrentUser     } from '../services/current-user';
import { Global          } from '../services/global';
import { ObserverService } from '../services/observer';
import { SocketServer    } from '../services/socket-server';
import { ServerInterface } from '../services/server-interface';
import { PonyboxService  } from '../services/ponybox';
import { UserFactory     } from '../services/factory/user-factory';
import { ChannelFactory  } from '../services/factory/channel-factory';
import { MessageFactory  } from '../services/factory/message-factory';

import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';

let urlServer = 'https://frenchy-ponies.fr:2096';

/*if (isDevMode()) {
    urlServer = 'http://localhost:8080';
}*/

const socketIoConfig: SocketIoConfig = { url: urlServer, options: {} };

@NgModule({
  declarations: [
    MyApp,
    
    FormMessageComponent,
    MessageComponent,
    ChannelComponent,
    PonyboxToolbarComponent,
  
    LoginPage,
    PonyboxPage,
    HelpPage,
    UsersListPage,
    ChannelsListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    SocketIoModule.forRoot(socketIoConfig),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    PonyboxPage,
    HelpPage,
    UsersListPage,
    ChannelsListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Config,
    NativePageTransitions,
    ApiProvider,
    Auth,
    CurrentUser,
    Global,
    ObserverService,
    ServerInterface,
    SocketServer,
    UserFactory,
    ChannelFactory,
    MessageFactory,
    PonyboxService
  ]
})
export class AppModule {}
