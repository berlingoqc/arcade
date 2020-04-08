import apicalypse from 'apicalypse';
import { db } from './storage';


export interface Cover {

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

export class GameInfoData {
    type: 'pending' | 'complete' | 'error';
    data: any;
}


export async function getGameData(name: string): Promise<GameInfoData> {
    let data = new GameInfoData();
    const d = await db.get(name);
    if (d) {
        console.log('WE GOT THAT ALREADY');
        try {
            return JSON.parse(d);
        } catch (err) {
            await db.delete(name);
            return getGameData(name);
        }
    } else {
        try {
            const e = await fetchingGameData(name);
            data.type = 'pending';
            if(e.length === 1) {
                data.data = e[0];
            } else {
                data.data = e;
            }
            data.data = e;
            await db.put(name, JSON.stringify(data));
            return data;
        } catch (err) {
            data.type = 'error';
            if (err['toJSON']) {
                data.data = err.toJSON();
            } else {
                data.data = JSON.stringify({
                    error: 'parsing error'
                });
            }
        }
    }
    return data;
}

export async function selectGoodGame(name: string, index: number): Promise<GameInfoData> {
    const d = await db.get(name);
    if (d) {
        const gi = JSON.parse(d) as GameInfoData;
        gi.data = gi.data[index];
        await db.put(name, JSON.stringify(gi));
    }
    return null;
}

export async function fetchingGameData(name: string): Promise<GameInfo[]> {
    console.log('MUST GETT THAT')
    try {
        const response = await request()
            .fields(['name', 'category', 'cover', 'summary', 'storyline', 'screenshots'])
            .search(name) // search for a specific name (search implementations can vary)
            .request('https://api-v3.igdb.com/games/');
        const data = response.data as GameInfo[];


        for (const gi of data) {
            const responseCover = await request()
                .fields('url')
                .where(`id = ${gi.cover}`)
                .request('https://api-v3.igdb.com/covers/'); // execute the query and return a response object

            gi.coverData = responseCover.data[0];
            console.log(data);
        }
        return data;
    } catch (err) {
        console.log('ERROR', err);
        throw err;
    }
}

function request() {
    return apicalypse({
        queryMethod: 'body',
        headers: {
            'user-key': 'c1c5b42b4a7f37df8e7f0b69c6a0409e'
        }
    })
}