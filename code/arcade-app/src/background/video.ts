import { LitElement, customElement, html, property, css } from "lit-element";


@customElement('arc-video-background')
export class VideoBackgroundComponent extends LitElement {

    static get styles() {
        return css`
        video {
        position: fixed;
        right: 0;
        bottom: 0;
        min-width: 100%; 
        min-height: 100%;
        }
        `;
    }


    @property({ type: String })
    file: string = 'file:///home/wq/Downloads/file_example_MP4_1920_18MG.mp4';

    render() {
        this.dispatchEvent(new Event('backgroundready'));

        return html`
        <video autoplay muted loop id="video">
            <source src="${this.file}" type="video/mp4">
        </video>
        `;
    }


    firstUpdated() {
    }

}