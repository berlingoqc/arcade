import { SnapDB } from 'snap-db';

let file: string = 'test_db';
export let db: SnapDB<any>;


export function initDB(folder: string = file) {
    file = folder;
    db = new SnapDB(file);
}
