import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SocketServer {    
    constructor(
        public socket : Socket
    ) {
        
    }
    
    connect() {
        this.socket.connect();
    }
    
    disconnect() {
        this.socket.disconnect();
    }
    
    protected _checkConnexion() {
        if (this.socket.ioSocket.connected === false) {
            this.connect();
        }
    }
    
    emit(...args: any[]) {
        this._checkConnexion();
        this.socket.emit.apply(this.socket, args);
    }
    
    observe(socket :string) {
        return new Observable(observer => {
            this.socket.on(socket, (data: any) => {
                observer.next(data);
            });
        })
    }
}