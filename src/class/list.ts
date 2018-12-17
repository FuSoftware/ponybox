export class List<A> {
    protected actualIndex: number = 0;

    constructor(public list: Array<A> = []) {}
    
    reset() : this {
        this.setList([]);
        return this;
    }
    
    setList(newList: Array<A>): this {
        this.list = newList;
        this.actualIndex = 0;
        return this;
    }
    
    isLast(): boolean {
        return (this.numberUntilEnd() === 0);
    }
    
    isStart() : boolean {
        return (this.numberUntilStart() === 0);
    }
    
    next(): A {
        if (this.isLast()) {
            return null;
        }
        this.actualIndex++;
        return this.current();
    }
    
    prev(): A {
        if (this.isStart()) {
            return null;
        }
        this.actualIndex--;
        return this.current();
    }
    
    current(): A {
        return this.list[this.actualIndex];
    }
    
    currentIndex(): number {
        return this.actualIndex;
    }
    
    add(items: A|Array<A>): this {
        if (!(items instanceof Array)) {
            items = [items];
        }
        this.list = this.list.concat(items);
        return this;
    }
    
    remove(index: number) : this {
        this.list.splice(index, 1);
        return this;
    }
    
    length(): number {
        return this.list.length;
    }
    
    numberUntilEnd(): number {
        return (this.list.length - (this.actualIndex - 1));
    }
    
    numberUntilStart(): number {
        return this.actualIndex;
    }
}