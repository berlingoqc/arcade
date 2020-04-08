
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

export const applicationEntryPaths = [
  '/usr/share/applications',
  '/home/wq/.wine32/drive_c/users/wq/Desktop/',
  '/usr/local/share/applications',
  '$HOME/.local/share/applications'];
export const iconPaths = ['$HOME/.icons', '$XDG_DATA_DIRS/icons', '/usr/share/pixmaps'];


import { DesktopEntry } from '../../../model/desktop-entry';

export function findIconPath(entry: DesktopEntry): string {
  const files = aggregateFolderFile([entry.Path, ...iconPaths]);
  const file = files.find(y => y.includes(entry.Icon));
  if (file) {
    return file;
  } else {
    return '';
  }
}


export class DesktopEntryList {

  constructor(public items: DesktopEntry[]) { }

  filterByField(field: string, value: string) {
    return this.items.filter(item => {
      if (item.hasOwnProperty(field)) {
        if (Array.isArray(item[field])) {
          return (item[field] as any[]).findIndex(x => x === value) > -1;
        } else {
          return value === item[field];
        }
      }
    });
  }
}

export function getEntries(): DesktopEntry[] {
  const files = aggregateFolderFile(applicationEntryPaths);
  return files.map(file => {
    const entry = new DesktopEntry();
    parseConfigFile(entry, file);
    if (entry.Icon) {
      entry.Icon = findIconPath(entry);
    }
    return entry;
  });
}

export function parseConfigFile<T>(obj: T, path: string): T {
  const file = readFileSync(path);
  if (file) {
    const lines = file.toString().split('\n');
    for (const line of lines) {
      // debut d'une nouvelle object
      if (line.startsWith('[')) {
      } else if (line === '') {
        continue;
      } else {
        const split = line.split('=');
        const v = line.split('=');
        v.shift();
        const value = v.join('=');
        if (obj.hasOwnProperty(split[0])) {
          if (Array.isArray(obj[split[0]])) {
            const data = value.split(';');
            obj[split[0]] = data;
          } else {
            obj[split[0]] = value;
          }
        }
      }
    }
  }
  return obj;
}

export function aggregateFolderFile(folders: string[]): string[] {
  const files = [];
  folders.forEach(folder => {
    try {
      const f = readdirSync(folder);
      files.push(...f.map(x => join(folder, x)));
    } catch (e) { }
  });
  return files;
}
