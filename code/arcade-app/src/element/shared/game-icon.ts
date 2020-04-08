import { LitElement, property, html, css, customElement } from "lit-element";
import { ipc } from "../../ipc/electron";
import { DesktopEntry } from "../../api";

@customElement('arc-game-icon')
export class GameIconElement extends LitElement {

    static getStyles() {
        return css`
        .item {
            height: 200px;
            width: 200px;
            display: flex;
            justify-content: center;
        }

        .item div {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .item h4 {
            text-align: center;
        }

        .item:focus {
            background-color: grey;
        }
        .item:hover {
            background-color: grey;
        }
        `;
    }

    @property({ type: String})
    lol1: string = 'lol'


    @property({ type: String})
    lol: string = 'lol';

    @property({ type: String})
    imgPrefix: string = 'https'

    // desktop entry as commentary
    @property({ type: Object })
    entry: DesktopEntry = new DesktopEntry();

    startProgram() {
        ipc.send('switchApp', JSON.stringify(this.entry));
    }

    render() {
         this.updateComplete.then(() => {
                const item = this.shadowRoot?.querySelectorAll('.item');
                if(item) {
                }
            });
        return html`
        <div id="{{e.Name}}" tabindex="0" class="item" @click="${this.startProgram}">
            <div>
                <img src="${this.imgPrefix}://${this.entry.Icon}" width="100" height="100">
                <h4>${this.entry.Name}</h4>
            </div>
        </div>
        `
    }
}