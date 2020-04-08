

import { Subject } from 'rxjs';


function startListenGamepad() {
    setInterval(() => {
        let gamepads = navigator.getGamepads();
        if (gamepads[0]) {
            const gp = gamepads[0];
            if (gp.axes[0] !== 0) {
                leftAxisSubject.next({x: gp.axes[0], y: gp.axes[1]});
            }
            if(gp.axes[2] !== -1 && gp.axes[2] !== 0) {
                leftTriggerSubject.next(gp.axes[2]);
            }
            if(gp.axes[5] !== -1 && gp.axes[5] !== 0) {
                rightTriggerSubject.next(gp.axes[5]);
            }
            if (gp.buttons[0].pressed) {
                buttonA.next(gp.buttons[0]);
            }
            if (gp.buttons[1].pressed) {
                if(onButtonB) {
                    onButtonB();
                }
            }
            if (gp.buttons[2].pressed) {
                if(onButtonX) {
                    onButtonX();
                }
            }
            if (gp.buttons[3].pressed) {
                if(onButtonY) {
                    onButtonY
                }
            }

        }
    }, 100);
}

window.addEventListener('gamepadconnected', () => {
    startListenGamepad();
});



export const leftTriggerSubject = new Subject<number>();
export const rightTriggerSubject = new Subject<number>();
export const leftAxisSubject = new Subject<{x:number; y: number}>();
export const buttonA = new Subject<GamepadButton>();

export let onButtonA: () => void;
export let onButtonB: () => void;
export let onButtonX: () => void;
export let onButtonY: () => void;

export function setOnButtonB(d: () => void) {
    onButtonB = d;
}

export function setOnButtonX(d: () => void) {
    onButtonX = d;
    onButtonY = d;
}
