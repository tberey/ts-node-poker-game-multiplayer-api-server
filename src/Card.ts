export class Card {
    
    private number: string;
    private suit: string;

    constructor(num:string,suit:string) {
        this.number = num;
        this.suit = suit;
    }

    public getNum():string {
        return this.number;
    }

    public getSuit():string {
        return this.suit;
    }
};