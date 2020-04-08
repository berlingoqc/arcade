
import { IpcRenderer, IpcRendererEvent, } from 'electron';
import { Subject, Observable } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

export let mode: 'electron' | 'socket';
export let socketSubject: Subject<string>;
export let ipc: IpcRenderer;




export function init(m: 'electron' | 'socket' = 'electron', data: any = {}) {
    mode = m;
    if (mode === 'electron') {
        if ((window as any).require) {
            try {
                ipc = (window as any).require('electron').ipcRenderer;
            } catch (e) {
                throw e;
            }
        }
    } else {
        const url = data.url;
        socketSubject = webSocket(url);
        socketSubject.subscribe();
    }
}



export function wrapperOn(name: string): Observable<any> {
    if (mode === 'electron') {
        return new Observable((subscription) => {
            ipc.on(name, (_: IpcRendererEvent, ...args: any[]) => {
                subscription.next(JSON.parse(args[0]));
            });
        });
    } else {
        return new Observable((subscribtion) => {
            socketSubject.subscribe((msg: any) => {
                console.log('WRAPPER ON ', msg);
                if(typeof msg === 'string') {
                    msg = JSON.parse(msg);
                }
                if(msg.message === name) {
                    subscribtion.next(msg.args[0]);
                }
            });
        });
    }
}

export function wrapperOnce(name: string, ...args: any[]): Promise<any> {
    if (mode === 'electron') {
        ipc.send(name, args);
        return new Promise((resolv) => {
            ipc.once(name + 'Return', (_: IpcRendererEvent, ...args: any[]) => {
                resolv(JSON.parse(args[0]));
            });
        });
    } else {
        socketSubject.next(JSON.stringify({
            message: name,
            args
        }));
        return new Promise((resolv) => {
            const subscribtion = socketSubject.subscribe((msg: any) => {
                if(typeof msg === 'string') {
                    msg = JSON.parse(msg);
                }
                if(msg.message === name + 'Return') {
                    const data = msg.args[0];
                    resolv(JSON.parse(data));
                }
                subscribtion.unsubscribe();
            });
        });
    }
}
