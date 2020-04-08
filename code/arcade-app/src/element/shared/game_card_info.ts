import { customElement, property, html } from "lit-element";
import { GameInfoData, GameInfo } from "../../api";
import { BaseCSSStyle, getBaseStyle } from "../style";




@customElement('arc-game-card-info')
export class GameCardInfo extends BaseCSSStyle {

    static getStyles() {
        return getBaseStyle();
    }

    @property({type: Object})
    gameInfo: GameInfoData;

    @property({type: String})
    elementName: string;

    render() {
        if(!this.gameInfo) {
            return html``
        }
        return html`
        <div class="container-center" style="height: 70%;">
            ${this.renderData()}
        </div>
        `;
    }

    renderData() {
        console.log(this.gameInfo);
        switch(this.gameInfo.type) {
            case 'complete':
                return this.renderOne(this.gameInfo.data);
            case 'pending':
                if((this.gameInfo.data as any).length === 0) {
                    return this.renderNoData();
                } else {
                    return this.renderMultiple();
                }
            case 'error':
                return this.renderError()
        }
    }

    renderMultiple() {
        return html`
        <div class="container-center column">
            <div>Plusieurs possibilité</div>
            <div class="container-center column">
                ${this.gameInfo.data.map((gi: GameInfo) => html`${this.renderOne(gi)}`)}
            </div>
        </div>
        `;
    }

    renderOne(gameInfo: GameInfo) {
        return html`
            <div class="contai-center column">
                <img src="${ (gameInfo.coverData) ? 'https:'+ gameInfo.coverData.url : ''}">
                <div>
                    <h5>${gameInfo.name}</h5>
                </div>
            </div>
        `;
    }


    renderNoData() {
        return html`
            <div>
                essayé avec un autre nom ?
                <input value="${this.elementName}">
            </div>
        `;
    }

    renderError() {
        return html`
            ${JSON.stringify(this.gameInfo.data).substring(0,100)}

            ${this.renderNoData()}
        `;
    }
}