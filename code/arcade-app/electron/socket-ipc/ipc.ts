
import { ipcMain, IpcMainEvent, BrowserWindow } from 'electron';
import { Server, Data } from 'ws';
import { SocketMessage, getSocketIpcMainEvent, broadcastMessage } from './socket';

export class SocketElectronIPC {

    wss: Server;
    handler: { [id: string]: (event: IpcMainEvent, ...args: any[]) => void }

    constructor(private win: BrowserWindow) {
        this.handler = {};

        this.wss = new Server({
            port: 8080
        });
        this.wss.on('message', (message: string) => this.handleWebSocketEvent(message));

        this.wss.on('connection', (ws) => {
            console.log('CONENTIN');
            ws.on('message', (message) => this.handleWebSocketEvent(message));
        })
    }


    send(message: string, ...args: any[]) {
        broadcastMessage(this.wss,message, ...args);
        this.win.webContents.send(message, ...args);
    }

    on(message: string, callback: (event: IpcMainEvent, ...args: any[]) => void, electronOnly = false): this {
        ipcMain.on(message, callback);
        if(!electronOnly) {
            this.handler[message] = callback;
        }
        return this;
    }

    handleWebSocketEvent(message: Data) {
        let str = message.toString()
        let p = JSON.parse(str) as SocketMessage;
        p = JSON.parse(p as any);
        const callback = this.handler[p.message];
        console.log(this.handler, callback);
        if(callback) {
            callback(getSocketIpcMainEvent(this.wss), ...((p.args) ? p.args : [] ));
        } else {
            console.log('NO CALLBACK');
        }
    }
}


export let ipc: SocketElectronIPC;

export function init(browserWindows: BrowserWindow) {
    ipc = new SocketElectronIPC(browserWindows);
}