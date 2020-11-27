/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {Elevatable} from '@klipper/bow/mixins/Elevatable';
import {Themeable} from '@klipper/bow/mixins/Themeable';
import {MaxDragAction} from '@klipper/bow/touch/MaxDragAction';
import {getTargetPosition} from '@klipper/bow/utils/style';
import {mixins} from 'vue-class-component';
import {Component, Prop, Ref, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
@Component
export default class KSwipeItem extends mixins(
    Themeable,
    Elevatable,
) {
    @Prop({type: [Number, String], default: 12})
    public elevation?: number;

    @Prop({type: Boolean, default: false})
    public disabled!: boolean;

    @Ref('content')
    private readonly contentRef!: HTMLElement;

    @Ref('leftActions')
    private readonly leftActionsRef!: HTMLElement;

    @Ref('rightActions')
    private readonly rightActionsRef!: HTMLElement;

    private opened: boolean = false;

    private openedLeft: boolean = false;

    private openedRight: boolean = false;

    private drag: boolean = false;

    private dragLeft: boolean = false;

    private dragRight: boolean = false;

    private maxDrag: MaxDragAction|null = null;

    private dragStartPosition: number|null = null;

    private get classes(): Dictionary<boolean> {
        return {
            'k-swipe-item': true,
            'k-swipe-item--disabled': this.disabled,
            'action-opened': this.opened,
            'left-action-opened': this.openedLeft,
            'right-action-opened': this.openedRight,
            'drag': this.drag,
            'drag-left': this.dragLeft,
            'drag-right': this.dragRight,
            ...this.themeClasses,
        };
    }

    private get contentClasses(): Dictionary<boolean> {
        return {
            'k-swipe-item-content': true,
            ...this.elevationClasses,
        };
    }

    private get slotProps(): Dictionary<any> {
        return {
            disabled: this.disabled,
            opened: this.opened,
            openedLeft: this.openedLeft,
            openedRight: this.openedRight,
            drag: this.drag,
            dragLeft: this.dragLeft,
            dragRight: this.dragRight,
            close: this.close,
            openLeft: this.openLeft,
            openRight: this.openRight,
            toggleLeft: this.toggleLeft,
            toggleRight: this.toggleRight,
        };
    }

    public close(): void {
        this.contentRef.style.transform = '';
        this.contentRef.addEventListener('transitionend', this.closeTransitionEndHandler);
        this.opened = false;
    }

    public openLeft(): void {
        if (this.disabled) {
            return;
        }

        const max = this.leftActionsRef.offsetWidth;
        const lastPosition = getTargetPosition(this.contentRef);

        if (this.opened) {
            this.close();
        }

        this.opened = true;
        this.openedLeft = true;

        if (Math.abs(lastPosition) >= max) {
            this.openTransitionEndHandler();
        } else {
            this.contentRef.addEventListener('transitionend', this.openTransitionEndHandler);
        }

        this.contentRef.style.transform = 'translateX(' + Math.round(max) + 'px)';
    }

    public openRight(): void {
        if (this.disabled) {
            return;
        }

        const max = this.rightActionsRef.offsetWidth;
        const lastPosition = getTargetPosition(this.contentRef);

        if (this.opened) {
            this.close();
        }

        this.opened = true;
        this.openedRight = true;

        if (Math.abs(lastPosition) >= max) {
            this.openTransitionEndHandler();
        } else {
            this.contentRef.addEventListener('transitionend', this.openTransitionEndHandler);
        }

        this.contentRef.style.transform = 'translateX(' + Math.round(-max) + 'px)';
    }

    public toggleLeft(): void {
        if (this.opened) {
            this.close();
        } else {
            this.openLeft();
        }
    }

    public toggleRight(): void {
        if (this.opened) {
            this.close();
        } else {
            this.openRight();
        }
    }

    private onDragMove(e: TouchEvent): void {
        if (this.disabled) {
            return;
        }

        const delta = (e as any).touchmoveX - (e as any).touchstartX;

        // drag start
        if (!this.drag) {
            this.drag = true;
            this.dragLeft = this.openedLeft;
            this.dragRight = this.openedRight;
            this.dragStartPosition = getTargetPosition(this.contentRef);
            this.maxDrag = new MaxDragAction(this.leftActionsRef.offsetWidth, this.rightActionsRef.offsetWidth);
        }

        // drag
        this.contentRef.style.transform = 'translateX(' + this.getDelta((this.dragStartPosition || 0) + delta) + 'px)';
    }

    private onDragEnd(): void {
        if (this.disabled) {
            return;
        }

        const lastPosition = getTargetPosition(this.contentRef);

        (this.contentRef.style as any)['user-select'] = '';
        this.drag = false;
        this.maxDrag = null;
        this.dragStartPosition = null;

        const width = lastPosition > 0 ? this.leftActionsRef.offsetWidth : this.rightActionsRef.offsetWidth;
        const movement = Math.abs((this.opened ? -width : 0) + Math.abs(lastPosition));
        const openActionName = 'open' + (lastPosition > 0 ? 'Left' : 'Right');

        if ((movement / width) > 0.3) {
            if (this.opened) {
                this.close();
            } else {
                (this as any)[openActionName]();
            }
        } else if (this.opened) {
            (this as any)[openActionName]();
        } else {
            this.close();
        }
    }

    private closeTransitionEndHandler(): void {
        if (!this.opened) {
            this.openedLeft = false;
            this.openedRight = false;
        }

        if (!this.drag) {
            this.dragLeft = false;
            this.dragRight = false;
        }

        this.contentRef.removeEventListener('transitionend', this.closeTransitionEndHandler);
        this.$emit('actions-closed');
    }

    private openTransitionEndHandler(): void {
        if (this.openedLeft) {
            this.$emit('actions-left-opened');
        }

        if (this.openedRight) {
            this.$emit('actions-right-opened');
        }

        this.$emit('actions-opened');
    }

    private getDelta(delta: number): number {
        if (this.maxDrag) {
            if (delta > this.maxDrag.left) {
                delta = this.maxDrag.left;
            } else if (delta < -this.maxDrag.right) {
                delta = -this.maxDrag.right;
            }
        }

        return Math.round(delta);
    }

    @Watch('disabled')
    private watchDisabled(value: boolean): void {
        if (value) {
            this.close();
        }
    }
}
