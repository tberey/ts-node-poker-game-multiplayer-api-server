import { ServerRouter } from "./ServerRouter";
import { Socket } from "socket.io";
import { Game } from "./Game";
import { Player } from "./Player";
    
export class SocketsServer extends ServerRouter {
    
    private userSet: Set<string>;
    private game: Game;


    constructor(port:number, endPoint:string='') {
        super(port, endPoint);
        this.userSet = new Set();
        this.game = new Game(this.userSet);
        this.socketHandler();
    }


    private socketHandler():void {
        
        this.io.on('connection', (socket:Socket, serverMsg:string) => {
            
            console.log(`A connection was made by ${socket.request.session.username}!`);
            if (socket.request.session.username == 'TomADM') socket.emit('adminCheck', true);

            this.userSet.forEach((val) => {
                if (val == socket.request.session.username) {
                    socket.request.session.loggedin = false;
                    socket.request.session.username = null;
                    socket.request.session.save();
                }
            });

            if (!(socket.request.session.loggedin)) return socket.disconnect();

            socket.emit('yourUser', socket.request.session.username);
            this.userSet.add(socket.request.session.username);
            serverMsg = `'${socket.request.session.username}' connected.`;
            this.io.sockets.emit('deleteList', serverMsg);
            this.userSet.forEach(val => this.io.sockets.emit('userListItem', val));


            // Listen for any sockets disconnecting, to supply informative information to be logged.
            socket.on('disconnect', () => {
                // Emit to first clear client-side user lists (and send server msg to chat), next find and delete user from set, then resend user list set to all sockets, item by item.
                serverMsg = `'${socket.request.session.username}' disconnected.`;
                this.io.sockets.emit('deleteList', serverMsg);
                this.userSet.forEach(val => {
                    if (val == socket.request.session.username) this.userSet.delete(val);
                    else this.io.sockets.emit('userListItem', val);
                });
            });


            //var game:Game;
            socket.on('newGame', () => {
                this.game = new Game(this.userSet);
                let data:Array<Player> = this.game.getGameData();
                this.io.sockets.emit('yourMoney', 1000);
                this.io.sockets.emit('initGameData', data);
                data.forEach(player => {
                    if (player.getTurn()) {
                        this.io.sockets.emit('playerTurnUpdate', player);
                    }
                });
                this.io.sockets.emit('updatePot', this.game.getPot());
            });


            socket.on('fold', username => {
                this.game.fold(username);
                serverMsg = `<p class="message"><br><i>${username} folded.</i></p>`;
                this.io.sockets.emit('messageUpdate', serverMsg);
            });


            socket.on('bet', data => {
                this.game.bet(data);
            });


            socket.on('checkOrCall', data => {
                this.game.checkOrCall(data);
            });

            
            socket.on('nextTurn', (username:string) => {
                
                let roundStatus:boolean = this.game.nextTurn();
                
                if (roundStatus == false) {
                    serverMsg = `<p class="message"><br><i>Everyone is out.</i></p>`;
                    this.io.sockets.emit('messageUpdate', serverMsg);
                }

                let data:Array<Player> = this.game.getGameData();
                
                this.io.sockets.emit('initGameData', data);
                socket.emit('yourMoney', this.game.getPlayersMoney(username));
                
                data.forEach(player => {
                    if (player.getTurn()) {
                        this.io.sockets.emit('playerTurnUpdate', player);
                    }
                });

                this.io.sockets.emit('updatePot', this.game.getPot());
            });
        });
    }
}