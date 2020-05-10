import { Server } from "./Server"
import { Request, Response } from "express";

export class ServerRouter extends Server {
    constructor(port:number, endPoint:string='') {
        super(port);
        this.getRequests(endPoint);
        this.postRequests(endPoint);
        this.putRequests(endPoint);
        this.deleteRequest(endPoint);
    }

    private getRequests(endPoint:string):void {
        this.app.get('/', (req:Request,res:Response) => req.session!.loggedin ? res.status(307).redirect('/poker') : res.status(200).render('index'));
        this.app.get('/poker', (req:Request,res:Response) => req.session!.loggedin ? res.status(200).render('pokerRoom') : res.status(403).redirect('/'));
        this.app.get('*', (req:Request, res:Response) => res.status(404).redirect('/'));
    }

    private postRequests(endPoint:string):void {
        this.app.post('/login', (req:Request, res:Response) => {
            req.session!.username = req.body.username;
            req.session!.loggedin = true;
            res.status(200).send(`/poker`);
        });
    }

    private putRequests(endPoint:string):void {

    }

    private deleteRequest(endPoint:string):void {

    }
}