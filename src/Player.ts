import {Card} from "./Card";

export class Player {
    
    private name: string;
    private out: boolean;
    private dealer: boolean;
    private money: number;
    private hand: Array<Card>;
    private turn: boolean;
    private firstTurn:boolean;
    private action:string;
    public lastPlayerBet:boolean;

    constructor(name:string, amount:number) {
        this.name = name;
        this.turn = false;
        this.out = false;
        this.dealer = false;
        this.money = amount;
        this.hand = [];
        this.firstTurn = true;
        this.action = '';
        this.lastPlayerBet = false;
    }

    public addCardToHand(card:Card):string {
        //if (this.out) return `${this.name} is out.`;

        this.hand.unshift(card);
        return `${this.name} was dealt a card.`;
    }

    public discardHand() {
        this.hand = [];
    }

    public setName(name:string):void {
        this.name = name;
    }

    public setMoney(amount:number):void {
        this.money += amount;
        console.log('setMoney: ' + this.money);
    }

    public setFirstTurn(bool:boolean) {
        this.firstTurn = bool;
    }

    public getFirstTurn():boolean {
        return this.firstTurn
    }

    public fold():void {
        this.out = true;
    }

    public getName() {
        return this.name;
    }

    public getAndSetStatus():boolean {
        
        if (this.money >= 0) return this.out = false;
        else return this.out = true;
    }

    public getOutState():boolean {
        return this.out;
    }

    public setDealer(bool:boolean):boolean {
        
        //return this.dealer = bool;
        if (this.out && bool) return this.dealer = false;
        else return this.dealer = bool;
    }

    public setTurn(bool:boolean, newRound:boolean):boolean {
        
        if (this.out && bool && newRound || this.dealer && bool && newRound) return this.turn = false;
        else return this.turn = bool;
    }

    public getTurn():boolean {
        return this.turn;
    }

    public getDealer():boolean {
        return this.dealer;
    }

    public getMoney():number {
        return this.money;
    }
};