export class Collection {
    public collection: any = {};
    
    constructor() {

    }
    
    set(collection: Object) {
        this.collection = collection;
    }
    
    add(key: string, value: any) {
        this.collection[key] = value;
        return this;
    }
    
    setKey(key: string, value: any) {
        this.add(key, value);
        return this;
    }
    
    get(key: string = null, ifNotExist: any = null) {
        if (key === null) {
            return this.collection;
        }
        if (this.has(key)) {
            return this.collection[key];
        }
        return ifNotExist;
    }
    
    has(key: string) {
        return this.collection.hasOwnProperty(key);
    }
    
    remove(key: string) {
        if (this.has(key)) {
            delete this.collection[key];
        }
        return this;
    }
}