import { Injectable } from '@angular/core';
import { User } from '../../class/user';


@Injectable()
export class UserFactory {
    private saves: any = {};
    
    constructor() {

    }
    
    private _formatColor(color: string) {
        if (color !== null) {
            if (color[0] !== '#') {
                return '#' + color;
            }
        }
        return color;
    }
    
    create(user : any, update: boolean = true) {
        let userObject;
        if (user.hasOwnProperty('color')) {
            user.color = this._formatColor(user.color);
        }
        if (this.exists(user.uid)) {
            userObject = this.saves[user.uid];
            if (update) {
                userObject.setFromData(user);
            }
        } else {
            userObject = new User(user.uid);
            userObject.setFromData(user);
        }
        this.save(userObject);
        return userObject;
    }
    
    update(user: User|number, data: any) {
        let userId = (user instanceof User) ? user.id : user;
        data.id = userId;
        return this.create(data);
    }
    
    get(id: number) {
        if (this.exists(id)) {
            return this.saves[id];
        }
        return null;
    }
    
    exists(id: number) {
        return this.saves.hasOwnProperty(id);
    }
    
    save(user: User) {
        this.saves[user.id] = user;
    }
}



