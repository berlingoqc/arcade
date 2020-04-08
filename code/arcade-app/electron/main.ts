import { app, BrowserWindow, IpcMessageEvent, IpcMainEvent } from 'electron';


import './game_info';

import { applicationEntryPaths, aggregateFolderFile, parseConfigFile, DesktopEntryList, findIconPath, getEntries } from './config-parser/parser';

import { switchProgram } from './runner';

import * as path from 'path';
import * as url from 'url';

import { initDB, db } from './storage';
import { fetchingGameData, getGameData } from './game_info';

import { ipc as ipcMain, init } from './socket-ipc/ipc';

import * as fs from "fs";

import * as ts from "typescript";
export let win: BrowserWindow;

app.on('ready', createWindow);

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { nodeIntegration: true }
  });


  win.loadURL(
    url.format({
      pathname: path.join(__dirname, `/index.html`),
      protocol: 'file:',
      slashes: true
    })
  );

  init(win);
  win.webContents.openDevTools();
  //win.setFullScreen(true);

  initDB();

  win.on('closed', () => {
    win = null;
  });

  ipcMain.on('desktopEntry', (event: IpcMainEvent) => {
    console.log('DESKTOP ENTRY REQUEST');
    const list = new DesktopEntryList(getEntries());
    event.sender.send('desktopEntryReturn', JSON.stringify(list.filterByField('Categories', 'Game')));
    // event.sender.send(JSON.stringify(getEntries()));
  });

  ipcMain.on('gameInfo', (event: IpcMainEvent, ...args: any[]) => {
    getGameData(args[0]).then((gi) => {
      event.sender.send('gameInfoReturn', JSON.stringify(gi));
    });
  });

  ipcMain.on('switchApp', (event: IpcMainEvent, ...args: any[]) => {
    win.minimize();
    win.hide();
    console.log(args);
    const d = JSON.parse(args[0]);
    const prom = switchProgram(d);
    if (prom) {
      prom.then(() => {
        console.log('MAXIMALIEE');
        win.show();
      });
    }
  });

}
