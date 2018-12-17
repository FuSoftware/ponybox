import { Injectable } from '@angular/core';
import { User } from '../class/user';
import { UserFactory } from './factory/user-factory';

@Injectable()
export class CurrentUser {
    user: User = null;
    
    constructor(
        private userFactory : UserFactory
    ) {
        
    }
    
    isAuth() {
        return this.user !== null;
    }

    createFromData(data: any) {
        this.user = this.userFactory.create(data);
    }
    
    logout() {
        this.user = null;
    }
}