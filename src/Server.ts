import express, { Express } from "express";
import SocketIOServer from "socket.io";
import bodyParser from "body-parser";
import http from "http";
import session from "express-session";
import privateData from "./config/private.json";

export class Server {

    protected app: Express;
    private server: http.Server;
    private port: number;
    protected io:SocketIOServer.Server;
    private sessionMiddleware:express.RequestHandler;
    
    
    constructor(port:number) {
        this.port = port;
        this.app = express();
        this.server = new http.Server(this.app);
        this.io = SocketIOServer(this.server,);
        this.sessionMiddleware = session({
            secret: privateData.sessionSecret,
            saveUninitialized: true,
            resave: true
        })
        this.otherServerSetup();
        this.startServer();
    }

    private startServer():void {
        this.server.listen(this.port, '0.0.0.0', () => {
            console.log( `Server has started at http://localhost:${this.port}/` );
        });
    }

    private otherServerSetup():void {
        
        // Express middleware private session data/setup.
        this.io.use((socket, next) => {
            this.sessionMiddleware(socket.request, socket.request.res, next);
        });
        this.app.use(this.sessionMiddleware);

        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());

        this.app.set('view engine', 'ejs');
        this.app.use(express.static('public'));
    }
}