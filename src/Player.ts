import {Card} from "./Card";
import {Deck} from "./Deck";

export class Player {
    
    private name: string;
    private out: boolean;
    private dealer: boolean;
    private money: number;
    private hand: Array<Card>;
    private turn: boolean;

    constructor(name:string, amount:number) {
        this.name = name;
        this.turn = false;
        this.out = false;
        this.dealer = false;
        this.money = amount;
        this.hand = [];
    }

    public addCardToHand(card:Card):string {
        if (this.out) return `${this.name} is out.`;

        this.hand.unshift(card);
        return `${this.name} was dealt a card.`;
    }

    public setName(name:string):void {
        this.name = name;
    }

    public setMoney(amount:number):void {
        this.money = amount;
    }

    public checkAndSetStatus(out:boolean):boolean {
        
        if (this.money <= 0) {
            this.out = false;
        } else this.out = out;
        
        this.out = out;
        return this.out;
    }

    public setDealer(bool:boolean, index:number):number {
        
        if (this.out == true) {
            this.dealer = false;
            return index+1;
        }
        
        this.dealer = bool;
        return -1;
    }

    public setTurn(bool:boolean, index:number):number {
        
        if (this.out == true) {
            this.turn = false;
            return index+1;
        }
        
        this.turn = bool;
        return -1;
    }
};