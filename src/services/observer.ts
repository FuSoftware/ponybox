import { Injectable } from '@angular/core';
import { Subscriber } from 'rxjs/Subscriber';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ObserverService {
    subscribers : any = {};
    lastSend: any = {};
    
    observe(name: string) {
        return new Observable((subscriber: Subscriber<any>) => {
            this._addSubscriber(name, subscriber);
        });
    }
    
    clear() {
        for (var i in this.subscribers) {
            for (var j in this.subscribers[i]) {
                this.subscribers[i][j].unsubscribe();
            }
        }
        this.subscribers = {};
    }
    
    emit(name: string, value?: any) {
        this.lastSend[name] = value;
        if (this.subscribers.hasOwnProperty(name)) {
            for (let i = 0, len = this.subscribers[name].length; i < len; i++) {
                this.subscribers[name][i].next(value);
            }
        }
    }
    
    protected _addSubscriber(name: string, subscriber: Subscriber<any>) {
        if (!this.subscribers.hasOwnProperty(name)) {
            this.subscribers[name] = [];
        }
        if (!this.lastSend.hasOwnProperty(name)) {
            this.lastSend[name] = null;
        }
        this.subscribers[name].push(subscriber);
        //subscriber.next(this.lastSend[name]);
    }
}
