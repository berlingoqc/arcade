import { exec, spawn } from 'child_process';
import { DesktopEntry } from 'arcade-app-shared-module';
import { ipc } from './socket-ipc/ipc';



export let currentlyRunning = false;
export let gameRunning: DesktopEntry = undefined;


export function switchProgram(name: DesktopEntry): Promise<any> {
  if(currentlyRunning) {
    return null;
  }
  console.log('EXEC', name);
  const prog = exec(name.Exec);

  gameRunning = name;
  currentlyRunning = true;

  ipc.send('gameStarted', name);

  return new Promise((resolv) => {
    prog.on('close', () => {
      currentlyRunning = false;
      ipc.send('gameStopped', name);
      resolv(null);
    });
  });
}
