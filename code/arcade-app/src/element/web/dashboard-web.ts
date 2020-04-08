
import { LitElement, customElement, html } from 'lit-element';

import { Subject } from 'rxjs';
import { onProgramStarted, onProgramStopped } from '../../api';
import { DesktopEntry } from 'arcade-app-shared-module';

@customElement('arcade-web')
export class ArcadeDashboardWebElement extends LitElement {

    wsSubject: Subject<string>;

    running: DesktopEntry;

    constructor() {
        super();

        onProgramStarted().subscribe((de) => {
            this.running = de;
            this.requestUpdate();
            console.log(this.running);
        });
        onProgramStopped().subscribe((_) => {
            this.running = null;
            console.log('program closed');
            this.requestUpdate();
        })
    }


    render() {
        this.updateComplete.then(() => {
        });
        return html`
        <div style="position: relative; min-height: 100%; display: flex; justify-content: center; align-items: center">
            ${(this.running) ? html`<arc-game-icon .entry=${this.running}></arc-game-icon>` : html``}
        </div>
        `;
    }

}
