import { Deck } from "./Deck";
import { Player } from "./Player";


export class Game {
    
    private userSet: Set<string>;
    private players: Array<Player>=[];
    private deck: Deck;
    private gameInSession: boolean = false;
    public playersIndex: number;
    private pot: number;
    private amountToCall: number;
    

    constructor(userSet:Set<string>) {
        this.playersIndex = 0;
        this.pot = 0;
        this.amountToCall = 0;
        this.userSet = userSet;
        this.deck = new Deck();
        
        this.userSet.forEach(user => {
            this.players.unshift(new Player(user, 1000));
        });
        
        for (let h=0; h < 2; h++) {
            this.players.forEach(player => {
                player.addCardToHand(this.deck.dealCard());
            });
        }
        
        this.gameInSession = true;
        this.newRound(0);      
    }


    public getGameData():Array<Player> {
        return this.players;
    }


    public getPot():number {
        return this.pot;
    }

    public getPlayersMoney(uname:string):number {
        let x:number = 123;
        this.players.forEach(player => {
            if(player.getName() == uname) return x = player.getMoney();
        });
        return x;
    }


    public redealHands():void {

        this.players.forEach(player => player.discardHand());

        for (let h=0; h < 2; h++) {
            this.players.forEach(player => {
                
                if (!this.deck.length()) {
                    console.log(this.deck.length() + ' cards left in the deck. New shuffled deck.');
                    this.deck = new Deck();  
                }

                player.addCardToHand(this.deck.dealCard());
            });

            console.log(this.deck.length() + ' cards left in the deck.');
        }
    }


    public newRound(route:number):boolean {
        
        this.players.forEach(player => player.setFirstTurn(true));

        if (route > 0) this.redealHands();

        let outCount: number = 0;
        this.players.forEach(player => {
            
            if (player.getAndSetStatus()) {
                outCount++;
            }

            if (outCount >= this.players.length) {
                console.log('GAMEOVER');
                this.gameInSession = false;
            }
        });
        if (!this.gameInSession) {
            this.gameOver();
            return false;
        }

        let index:number = -1;
        let newGame:boolean = true; // to prevent the for each loop rerunning into the big if statement, after resolution.
        this.players.forEach(player => {
            
            index++;

            //console.log('i) ' + index, player.getDealer());
            if (player.getDealer() && newGame) {
                do {           
                    
                    if (index+1 > this.players.length-1) index = 0;
                    else index++;

                    //console.log('ii) ' + index, this.players[index].setDealer(true));

                    if(this.players[index].setDealer(true)) {
                        
                        //console.log('iii) ' + player.setDealer(false));
                        player.setDealer(false);

                        do {

                            if (index+1 > this.players.length-1) index = 0;
                            else index++;
                            
                            if (this.players[index].setTurn(true,true)) {
                                
                                newGame = false;
                                this.players[index].setFirstTurn(false);
                                
                                this.pot = 0;
                                this.players[index].setMoney(-30);
                                this.pot += 30;

                                this.amountToCall = 0;
                                
                                console.log('NEW ROUND');
                                break;
                            }

                        } while(true);

                        break;
                    }

                } while (true); 
            } else if ((index == this.players.length-1) && !player.getDealer() && newGame) {
                
                this.players[0].setDealer(true);
                this.players[1].setTurn(true,true);
                
                this.players[1].setMoney(-30);
                this.pot += 30;
                this.players[1].setFirstTurn(false);

                console.log('NEW GAME');
            }
        });
    
        return true;        
    }


    // When a clients folds, this is called to set player as out. If still have money, will be un-outed, by method.
    public fold(uname:string) {
        
        this.players.forEach(player => {
            if (uname == player.getName()) {
                player.fold();
            }
        });
    }

    
    public bet(data:Array<string>):void { 
        
        let uname:string = data[0];
        let amount:number = parseInt(data[1]);
        console.log('betData: ' + data[0], data[1]);
        
        this.players.forEach(player => {
            
            player.lastPlayerBet = false;

            if (player.getName() == uname) {
                player.setMoney(-(amount + this.amountToCall));
                this.pot += amount;
                player.lastPlayerBet = true;
            }
        });
        this.amountToCall += amount;
        amount = 0;
    }


    public checkOrCall(uname:string) {
        if (this.amountToCall < 0) {
            console.log('Called.');
            this.players.forEach(player => {
                if (player.getName() == uname) {
                    player.setMoney(-this.amountToCall);
                    this.pot += this.amountToCall;
                }
            });
            console.log('Checked.');
        }
    }


    public endRound(route:number):void {
        this.newRound(route);
    }


    // On a new round, call this to bring players back in, who have money.
    public checkAllStatus():void {
        this.players.forEach(player => {
            player.getAndSetStatus();
        });
    }


    // Once a decision has been made by a client, call this to process next turn.
    public nextTurn():boolean {
        
        let status:boolean = false;
        
        let i:number = -1;
        for (let p:number=0; p < this.players.length; p++) {
            
            i++;
            //console.log('i) players[p].getTurn, p, i : ' + this.players[p].getTurn(), p, i);
            
            if (this.players[p].getTurn()) {
                
                this.players[p].setFirstTurn(false);
                this.players[p].setTurn(false,false);
                
                let outCount:number;
                do { 
                    
                    outCount = 0;
                    this.players.forEach(player => {
                        if (player.getOutState()) outCount++;
                    });

                    //console.log('outCount, i : ' + outCount, i);
                    if (i+1 > this.players.length-1) i = 0;
                    else i++;
                    p = this.players.length;

                    //console.log('players[i].setTurn(true), i : ' + this.players[i].setTurn(true,false), i);
                    if (outCount < this.players.length-1 && !this.players[i].getOutState() && this.players[i].setTurn(true,false)) {
                        
                        if (this.players[i].getFirstTurn()) {
                            this.players[i].setMoney(-30)
                            this.pot += 30;
                            this.players[i].setFirstTurn(false);
                        }
                        
                        status = true;
                        console.log('Continue Round');
                        break;

                    /*} else if (outCount == this.players.length) {
                        console.log('End Round. All Out');
                        this.endRound(0);
                        status = false;
                        break;*/

                    } else if (outCount == this.players.length-1) {
                        
                        console.log('End Round. All Out except 1.');
                        this.players.forEach(player => {
                            if (!player.getOutState()) player.setMoney(this.pot);
                        });
                        this.endRound(1);
                        status = false;
                        break;   
                    }

                } while (true);
            }               
        }

        return status;
    }


    public gameOver() {
        console.log('GameOver Function Ran...');
    }
}