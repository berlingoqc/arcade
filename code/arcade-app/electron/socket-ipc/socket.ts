import { Server } from 'ws';
import { IpcMainEvent } from 'electron';

export interface SocketMessage {
    message: string;
    args: any[];
}


export interface SocketIpcMainEvent extends IpcMainEvent {

}


export function getSocketIpcMainEvent(wss: Server): SocketIpcMainEvent {
    const s = {} as SocketIpcMainEvent;
    s.sender = {
        send: (message: string, ...args: any[]) => {
            console.log('SENDING RESPONSE');
            broadcastMessage(wss, message, ...args);
        }
    } as any;
    return s;
}

export function broadcastMessage(wss: Server, message: string, ...args: any[]) {
    console.log('broadcasting');
    wss.clients.forEach((client) => {
        console.log('SENDING TO CLIENT ')
        client.send(
            JSON.stringify({
                message,
                args
            })
        )
    });
}


export function startFileServer() {

}