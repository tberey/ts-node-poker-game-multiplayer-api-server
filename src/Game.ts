import { Deck } from "./Deck";
import { Player } from "./Player";


export class Game {
    
    private players: Array<Player>=[];
    private deck: Deck;
    private gameInSession: boolean = false;
    
    constructor(noPlayers:number) {
        
        this.deck = new Deck();
        
        for (let p=1; p < noPlayers+1; p++) {
            this.players.unshift(new Player(`Player${p}`, 1000));
        }
        
        for (let i=0; i < 2; i++) {
            this.players.forEach(player => {
                player.addCardToHand(this.deck.dealCard());
            });
        }
        
        this.players[0].setDealer(true,0);
        this.players[1].setTurn(true,0);
        this.gameInSession = true;
        this.roundOfGame();      
    }


    public roundOfGame():void {
        console.log(JSON.stringify(this.players));
        /*do {
            
        } while (this.gameInSession);*/
    }
}