import { LitElement, customElement, html, property, css } from "lit-element";
import { leftTriggerSubject, rightTriggerSubject, leftAxisSubject, buttonA } from "../gamepad/gamepad_handler";

const exitLeft = [
    { transform: 'translateX(0)' },
    { transform: 'translateX(-100%)' }
];
const appearRight = [
    { transform: 'translateX(100%)' },
    { transform: 'translateX(0)' }
];
const exitRight = [
    { transform: 'translateX(0)' },
    { transform: 'translateX(100%)' }
];
const appearLeft = [
    { transform: 'translateX(-100%)' },
    { transform: 'translateX(0)' }
];

const bumpLeft = [
    { transform: 'translateX(0)' },
    { transform: 'translateX(-7%)' },
    { transform: 'translateX(0)' }
];

const bumbRight = [
    { transform: 'translateX(0)' },
    { transform: 'translateX(7%)' },
    { transform: 'translateX(0)' }
];

export function range(start, end) {
    const d = [];
    for (let i = start; i <= end; i++) {
        d.push(i);
    }
    return d;
}

function chunk(t: any[], chunkSize: number) {
    var R = [];
    for (var i = 0; i < t.length; i += chunkSize)
        R.push(t.slice(i, i + chunkSize));
    return R;
}


@customElement('arc-carrousel')
export class CarrouselElement extends LitElement {
    static get styles() {
        return css`
        :host {
            width: 100%;
        }
        .row {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-evenly;
        }

        .focus {
            background-color: grey;
        }
        `;
    }

    @property({ type: Number })
    itemPerPage: 6;

    _entries: any[] = [];
    @property({ type: Array })
    set entries(e: any[]) {
        this._entries = e;
        this.performUpdate();
    };
    get entries() { return this._entries; }

    currentPageAnimation: Animation = null;
    nextPageAnimation: Animation = null;
    bumpPageAnimation: Animation = null;
    direction = 0;
    currentPage = 0;

    index = -1;
    focusItems: Element[] = [];


    pages: NodeListOf<HTMLElement>;

    get entriesPage(): any[][] {
        const i = chunk(this.entries, 6);
        console.log(i);
        return i;
    }

    constructor() {
        super();
        this.itemPerPage = 6;
    }

    render() {
        this.updateComplete.then(() => this.resetPage());
        const entriesPage = this.entriesPage;
        let previousPage = 0;
        return html`
        <div style="width: 100%">
            <div style="position: relative; height: 400px">
                ${entriesPage.map((entries) => {
            return html`
                    <div style="position: absolute;width: 100%" class="row page">
                       ${entries.map((_) => { const d = html`<slot name="${previousPage}"></slot>`; previousPage += 1; return d; })}
                    </div>
                `})}
            </div>
            <div style="display: flex; justify-content: center">
                X X X X
            </div>
        </div>
        `;
    }

    navigate(v: { x: number; y: number }) {
        console.log(v.x);
        if (this.index > 1) {
            const e = new Event('caca') as any;
            const coord = this.focusItems[this.index].getBoundingClientRect();
            e.x = coord.x + coord.width / 2;
            e.y = coord.y + coord.height / 2;
            document.dispatchEvent(e)
        }
        const lastIndex = this.index;
        if (v.x == 1) {
            if (this.index + 1 < this.focusItems.length) {
                this.index += 1;
                this.setFocusOn(this.index);
            } else {
                this.rejected(1);
            }
        } else if (v.x == -1) {
            if (this.index - 1 >= 0) {
                this.index -= 1;
                this.setFocusOn(this.index);
            } else {
                this.rejected(1);
            }
        }
        if (lastIndex !== this.index && this.index !== 0) {
            console.log(this.index, this.itemPerPage, this.index % this.itemPerPage);
            if ((this.index % this.itemPerPage) === 0 && !this.indexInPage(this.index)) {
                this.changePage(1, v.x);
            } else if ((lastIndex % this.itemPerPage) === 0 && !this.indexInPage(this.index)) {
                this.changePage(1, v.x);
            }
        }
    }

    indexInPage(index: number): boolean {
        const b = this.currentPage * this.itemPerPage;
        const m = b + this.itemPerPage;
        return (index >= b && index < m);
    }

    setFocusOn(n: number) {
        console.log('SETTINGS FOCUS TO', n);
        this.focusItems.forEach(x => x.classList.remove('focus'));
        this.focusItems[n].classList.add('focus');

        const e = new Event('itemSelected') as any;
        e.entry = this.entries[this.index];

        this.dispatchEvent(e);
    }

    firstUpdated() {
        leftTriggerSubject.asObservable().subscribe((v) => {
            console.log('L', v);
            if (v >= 0) {
                v = (v / 2) + 0.5;
                this.changePage(v, -1);
            } else if (v <= 0) {
                v = (v * -1) / 2;
                this.changePage(v, -1);
            }
        });

        rightTriggerSubject.asObservable().subscribe((v) => {
            console.log('R', v);
            if (v >= 0) {
                this.changePage(v, 1);
            }
        });

        buttonA.asObservable().subscribe(() => {
            const item = this.focusItems[this.index];
            if (item) {
                (item as HTMLElement).click();
            }
        })

        leftAxisSubject.asObservable().subscribe((x) => this.navigate(x));
    }

    resetPage() {
        this.pages = this.shadowRoot.querySelectorAll('.page');
        this.pages.forEach((p, i) => {
            if (i > 0) {
                p.style.display = 'none';
            }
        });
        setTimeout(() => {
            const slots = this.parentElement.querySelectorAll('arc-game-icon');
            console.log('SLOT', slots);
            this.focusItems = [];
            slots.forEach(s => {
                this.focusItems.push(s.shadowRoot.querySelector('.item'))
            });
            console.log(this.focusItems);
        }, 1000);

    }

    changePage(velocity: number, direction: number) {
        console.log(this.direction, this.currentPage);
        if (this.direction === 0) {
            const pastIndex = this.currentPage;
            const currentPage = this.pages.item(this.currentPage);
            const nextPage = this.pages.item(this.currentPage + direction);
            if (nextPage) {
                this.direction = direction;
                const currentAnim = (direction > 0) ? exitLeft : exitRight;
                const nextAnim = (direction > 0) ? appearRight : appearLeft;
                this.currentPageAnimation = currentPage.animate(currentAnim, { duration: 500 })
                this.currentPageAnimation.playbackRate = velocity;
                this.currentPageAnimation.play();
                this.currentPageAnimation.onfinish = () => {
                    if (this.direction === direction) {
                        currentPage.style.display = 'none';
                        this.currentPage += direction;
                        console.log('EMDING DIRECTION CURRENT PAGE');
                        if (!this.indexInPage(this.index)) {
                            this.index = this.currentPage * this.itemPerPage;
                            if (direction == -1) {
                                this.index += this.itemPerPage - 1;
                            }
                            this.setFocusOn(this.index);
                        }
                    }
                    this.currentPageAnimation = null;
                    this.direction = 0;
                    console.log('CURRENT PAGE OVER');
                }
                nextPage.style.display = 'flex';
                currentPage.style.display = 'flex';
                this.nextPageAnimation = nextPage.animate(nextAnim, { duration: 500 });
                this.nextPageAnimation.onfinish = () => {
                    console.log('NEXT PAGE OVER', this.direction, direction, this.currentPage, pastIndex);
                    if (this.direction !== direction && this.currentPage === pastIndex) {
                        nextPage.style.display = 'none';
                        console.log('ENDING NOT DIRECTION NONE NEXT PAGE');
                    }
                    this.nextPageAnimation = null;
                    this.direction = 0;
                    console.log('NEXT PAGE OVER');
                }
                this.nextPageAnimation.playbackRate = velocity;
                this.nextPageAnimation.play();
            } else {
                this.direction = 0;
                this.rejected(direction);
            }
        } else if (this.direction !== direction) {
            this.direction = direction;
            this.currentPageAnimation.reverse();
            this.nextPageAnimation.reverse();
        } else {
            if (this.currentPageAnimation && this.nextPageAnimation) {
                console.log('SETTONG VELOCITY')
                this.currentPageAnimation.playbackRate = velocity;
                this.nextPageAnimation.playbackRate = velocity;
            }
        }
    }
    rejected(direction: number) {
        if (!this.bumpPageAnimation) {
            const currentPage = this.pages.item(this.currentPage);
            const animation = (direction > 0) ? bumbRight : bumpLeft;
            this.bumpPageAnimation = currentPage.animate(animation, { duration: 500 });
            this.bumpPageAnimation.play();
            this.bumpPageAnimation.onfinish = () => this.bumpPageAnimation = null;
        }
    }
}