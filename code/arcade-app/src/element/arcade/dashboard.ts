
import { LitElement, customElement, html, css, property } from 'lit-element';
import { DesktopEntry } from 'arcade-app-shared-module';

import '../shared/game-icon';
import '../../background';
import '../../reusable';
import '../shared/game_card_info';

import { setOnButtonB } from '../../gamepad/gamepad_handler';
import { getGameInfo, getDesktopEntry, GameInfoData } from '../../api';
import { init } from '../../ipc';
import { GameCardInfo } from '../shared/game_card_info';



@customElement('arcade-dashboard')
export class ArcadeDashboardElement extends LitElement {

    static get styles() {
        return css`
        .container {
            display: flex;
        }

        .row {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-evenly;
        }

        arc-game-card-info {
            position: relative;
            top: 0;
            left: 100;
        }
        `;
    }

    @property({type: String})
    mode: 'electron' | 'socket' = 'electron';
    @property({type: String})
    modeData: string;

    entries: DesktopEntry[] = [];
    currentGameInfo: GameInfoData;

    selectedBackground: string = 'arc-wave-background';


    constructor() {
        super();
    }

    render() {
        this.updateComplete.then(() => {
        });
        return html`
        <div style="position: relative; min-height: 100%; display: flex; justify-content: center; align-items: center">
            <arc-background id="background" .background="${this.selectedBackground}" style="position: absolute;z-index: -1; width: 100%; height: 100%;"></arc-background>

            <div style="position: absolute; max-width: 70%; min-height: 20%; display: flex; justify-content: center; top: 30px;">
                <arc-game-card-info id="card" .gameInfo="${this.currentGameInfo}"></arc-game-card-info>
            </div>

            <arc-carrousel @itemSelected=${(e: Event) => this.rowChange(e)} .entries=${this.entries}>
                ${this.entries.map((entry,i) => html`<arc-game-icon slot="${i}" .entry=${entry}></arc-game-icon>`)}
            </arc-carrousel>
        </div>
        `;
    }

    rowChange(data: any) {
        const entry = data.entry as DesktopEntry;
        getGameInfo(entry.Name).then((gi) => {
            const elem = this.shadowRoot.getElementById('card') as GameCardInfo;
            elem.gameInfo = gi;
            elem.elementName = entry.Name;
            elem.requestUpdate();
            console.log('GOT GAME INFO');
        });
    }

    firstUpdated() {
        init(this.mode, { url: this.modeData });
        console.log(this.mode, this.modeData);
        console.log(getDesktopEntry().then(entries => {
            this.entries = entries;
            this.requestUpdate();
        }));

        setOnButtonB(() => {
            const e = this.shadowRoot.getElementById('background');
            (e as any).setNextBackground();
        });
    }

    
}
