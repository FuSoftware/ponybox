import { List } from '../list';

export class CallbackList<A> extends List<A> {
    public callback: any
    public beforeCallback : number = 0
    private callbackInProgress: boolean = false
    private stopCallback: boolean = false
    
    private callCallback() {
        if (this.callbackInProgress || this.stopCallback) return;
        this.callbackInProgress = true;
        this.callback((items : Array<A>) => {
            this.add(items);
            this.callbackInProgress = false;
            
            //Si on a ramené aucun item, alors on arrête d'appeller la callback
            if (items.length === 0) {
                this.stopCallback = true;
            }
        });
    }
    
    reset() : this {
        super.reset();
        this.stopCallback = false;
        return this;
    }
    
    initialize() {
        this.setList([]);
        this.callCallback();
    }
    
    next () {
        var item = super.next();
        if (this.numberUntilEnd() <= this.beforeCallback) {
            this.callCallback();
        }
        return item;
    }
}