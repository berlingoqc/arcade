import { LitElement, property, html, css, customElement } from "lit-element";

@customElement('arc-background')
export class BackgroundElement extends LitElement {

    static get styles() {
        return css`
        `;
    }

    availablesBackground: string[] = [
        'arc-wave-background', 'arc-star-background', 'arc-light-background', 'arc-rainbox-background', 'arc-pure-background',
        'arc-moon-background', 'arc-ripple-background', 'arc-video-background'
    ];

    availableBackgroundWithArgs: string[] = [
        'arc-video-background'
    ];

    innerBackground: string;
    current: HTMLElement;
    animationTransition: Animation;

    @property({ type: String })
    set background(b: string) {
        if (!this.animationTransition) {
            this.innerBackground = b;
            this.performUpdate();
        }
    };
    get background() { return this.innerBackground; }

    setNextBackground() {
        const e = this.shadowRoot.getElementById('dav');
        if (e) {
            e.style.display = 'block';
        }
        let index = this.availablesBackground.indexOf(this.background);
        if (index + 1 >= this.availablesBackground.length) {
            index = 0;
        } else {
            index += 1;
        }
        this.background = this.availablesBackground[index];
    }

    render() {
        this.updateComplete.then(() => {
            if (this.current) {
                this.shadowRoot.removeChild(this.current);
            }
            const dav = this.shadowRoot.getElementById('dav');
            dav.style.display = 'flex';
            let a = dav.animate([{ transform: 'scale(0,0)' }, { transform: 'scale(1,1)' }], { duration: 500 });
            this.animationTransition = a;
            a.play();
            this.current = document.createElement(this.background);
            this.shadowRoot?.insertBefore(this.current, dav);
            this.current.addEventListener('backgroundready', () => {
                a.onfinish = () => {
                    this.animationTransition = null;
                    dav.style.display = 'none';
                }
                if (a.playState === 'finished') {
                    a.reverse();
                } else {
                    a.reverse();
                }
            })
        })

        return html`
            <div id="dav" style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; position: absolute; background-color: grey;z-index: 1000">
                <div style="width: 80%; height:80%; background-color: red"></div>
            </div>
       `;
    }

}