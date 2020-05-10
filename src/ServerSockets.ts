import { ServerRouter } from "./ServerRouter";
import { Socket } from "socket.io";
import { Game } from "./Game";
    
export class SocketsServer extends ServerRouter {
    
    private userSet: Set<string>;

    constructor(port:number, endPoint:string='') {
        super(port, endPoint);
        this.userSet = new Set();
        this.socketHandler();
    }

    private socketHandler():void {
        
        this.io.on('connection', (socket:Socket, serverMsg:string) => {
            console.log(`A connection was made by ${socket.request.session.username}!`);

            this.userSet.forEach((val) => {
                if (val == socket.request.session.username) {
                    socket.request.session.loggedin = false;
                    socket.request.session.username = null;
                    socket.request.session.save();
                }
            });

            if (!(socket.request.session.loggedin)) return socket.disconnect();

            this.userSet.add(socket.request.session.username);
            serverMsg = `'${socket.request.session.username}' connected.`;
            this.io.sockets.emit('deleteList', serverMsg);
            this.userSet.forEach((val) => {this.io.sockets.emit('userListItem', val);});

            // Listen for any sockets disconnecting, to supply informative information to be logged.
            socket.on('disconnect', () => {
                // Emit to first clear client-side user lists (and send server msg to chat), next find and delete user from set, then resend user list set to all sockets, item by item.
                serverMsg = `'${socket.request.session.username}' disconnected.`;
                this.io.sockets.emit('deleteList', serverMsg);
                this.userSet.forEach((val) => {
                    if (val == socket.request.session.username) this.userSet.delete(val);
                    else this.io.sockets.emit('userListItem', val);
                });
            });

            socket.on('newGame', () => {
                new Game(this.userSet.size+1); // +1 is only for testing when one person connects, so there are two players.
            });

        });
    }
}