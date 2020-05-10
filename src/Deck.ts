import {Card} from "./Card";

export class Deck {
    
    public cards: Array<Card>;

    constructor() {
        this.cards = [];
        this.newDeck();
    }

    public newDeck():void {
        // Iterate through all suits.
        for (let s:number = 0; s < 4; s++) {
            
            // Iterate through all numbers and assign to array.
            for (let n:number = 1; n < 14; n++) {
                
                // Assign Face Card or Number.
                let cardIdentity: string;
                switch (n) {
                    case 1:
                        cardIdentity = 'Ace';
                    break;

                    case 11:
                        cardIdentity = 'Jack';
                    break;

                    case 12:
                        cardIdentity = 'Queen';
                    break;

                    case 13:
                        cardIdentity = 'King';
                    break;

                    default:
                        cardIdentity = n.toString();
                }

                // Assign the Card to our deck Array, with suit determined by switch statement.
                switch (s) {
                    case 0:
                        this.cards.unshift(new Card(cardIdentity,'Hearts'));  
                    break;

                    case 1:
                        this.cards.unshift(new Card(cardIdentity,'Diamonds'));
                    break;

                    case 2:
                        this.cards.unshift(new Card(cardIdentity,'Clubs'));
                    break;
                    
                    case 3:
                        this.cards.unshift(new Card(cardIdentity,'Spades'));
                    break;
                }
            }
        }

        // Suffle the completed, ordered deck.
        let tmpCard:Card;
        for (let i:number = 0; i < 999; i++){
            for (let c:number = 0; c < this.cards.length; c++) {
                let rndNo:number = Math.floor(Math.random() * this.cards.length);
                tmpCard = this.cards[c];
                this.cards[c] = this.cards[rndNo];
                this.cards[rndNo] = tmpCard;
            }
        }
    }

    
    public dealCard() {
        let newCard = new Card('0','0');
        return this.cards.pop() || newCard;
    }
}