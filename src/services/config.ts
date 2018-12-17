import { Injectable, isDevMode } from '@angular/core';

@Injectable()
export class Config {
    public config: any = {
        apiUrl : {
            dev : 'http://frenchy.local/ponybox',
            prod: 'https://frenchy-ponies.fr/ponybox'
        }
    }
    
    public getEnv() {
        if (isDevMode()) {
            return 'prod';
        } else {
            return 'prod';
        }
    }
    
    public get(name: string): any {
        if (!this.config.hasOwnProperty(name)) return null;
        
        let getConfig = this.config[name];
        if (getConfig instanceof Object && getConfig.hasOwnProperty('dev') && getConfig.hasOwnProperty('prod')) {
            return getConfig[this.getEnv()];
        }
        return getConfig;
    }
}