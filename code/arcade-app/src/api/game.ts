import { wrapperOnce, wrapperOn } from "../ipc/electron";
import { Observable } from "rxjs";

export interface Cover {
    url: string;
}


export interface Screenshot {

}

export interface GameInfo {
    id: number;
    name: string;
    category: any;
    cover: number;
    coverData?: Cover;
    summary: string;
    storyline: string;
    screenshots: number[];
    screenshotsData: Screenshot[];
}

export class DesktopEntry {
    Type: string = '';
    Version: string = '';
    Name: string = '';
    Comment: string = '';
    Path: string = '';
    Exec: string = '';
    Icon: string = '';
    Terminal: boolean = false;
    Categories: string[] = [];
    Keywords: string[] = [];
}

export class GameInfoData {
    type: 'pending' | 'complete' | 'error';
    data: any;
}


export function getDesktopEntry(): Promise<DesktopEntry[]> {
    return wrapperOnce('desktopEntry');
}

export function getGameInfo(name: string): Promise<GameInfoData> {
    return wrapperOnce('gameInfo', name);
}

export function onProgramStarted(): Observable<DesktopEntry> {
    return wrapperOn('gameStarted');
}

export function onProgramStopped(): Observable<DesktopEntry> {
    return wrapperOn('gameStopped');
}