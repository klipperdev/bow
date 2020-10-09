<!--
This file is part of the Runr package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div :disabled="disabled" :class="classes" v-touch="{move: onDragMove, end: onDragEnd}">
        <div class="k-swipe-item-actions left">
            <slot name="action-left"></slot>
        </div>
        <div class="k-swipe-item-actions right">
            <slot name="action-right"></slot>
        </div>
        <div :class="contentClasses">
            <slot name="default"></slot>
        </div>
    </div>
</template>

<script lang="ts">
    import {mixins} from 'vue-class-component';
    import {Component, Prop, Watch} from 'vue-property-decorator';
    import {Elevatable} from '@klipper/bow/mixins/Elevatable';
    import {Themeable} from '@klipper/bow/mixins/Themeable';
    import {MaxDragAction} from '@klipper/bow/touch/MaxDragAction';
    import {getTargetPosition} from '@klipper/bow/utils/style';
    import '@klipper/bow/components/KSwipeItem/KSwipeItem.scss';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component
    export default class KSwipeItem extends mixins(Themeable, Elevatable) {
        @Prop({type: [Number, String], default: 12})
        public elevation?: number;

        @Prop({type: Boolean, default: false})
        public disabled!: boolean;

        [key: string]: any;

        public opened: boolean = false;

        public openedLeft: boolean = false;

        public openedRight: boolean = false;

        public drag: boolean = false;

        public dragLeft: boolean = false;

        public dragRight: boolean = false;

        public get classes(): Record<string, boolean> {
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

        public get contentClasses(): Record<string, boolean> {
            return {
                'k-swipe-item-content': true,
                ...this.elevationClasses,
            };
        }

        private hammer?: HammerManager;

        private contentEl?: HTMLElement;

        private leftActionsEl?: HTMLElement;

        private rightActionsEl?: HTMLElement;

        private maxDrag?: MaxDragAction;

        private dragStartPosition?: number;

        public mounted(): void {
            this.contentEl = this.$el.querySelector('.k-swipe-item-content') as HTMLElement;
            this.leftActionsEl = this.$el.querySelector('.k-swipe-item-actions.left') as HTMLElement;
            this.rightActionsEl = this.$el.querySelector('.k-swipe-item-actions.right') as HTMLElement;
        }

        public closeAction(): void {
            const el = (this.contentEl as HTMLElement);
            this.opened = false;
            el.style.transform = '';
            el.addEventListener('transitionend', this.closeTransitionEndHandler);
        }

        public openLeftAction(): void {
            const el = (this.contentEl as HTMLElement);
            const max = (this.leftActionsEl as HTMLElement).offsetWidth;
            const lastPosition = getTargetPosition(el);

            if (this.opened) {
                this.closeAction();
            }

            this.opened = true;
            this.openedLeft = true;

            if (Math.abs(lastPosition) >= max) {
                this.openTransitionEndHandler();
            } else {
                el.addEventListener('transitionend', this.openTransitionEndHandler);
            }

            el.style.transform = 'translateX(' + Math.round(max) + 'px)';
        }

        public openRightAction(): void {
            const el = (this.contentEl as HTMLElement);
            const max = (this.rightActionsEl as HTMLElement).offsetWidth;
            const lastPosition = getTargetPosition(el);

            if (this.opened) {
                this.closeAction();
            }

            this.opened = true;
            this.openedRight = true;

            if (Math.abs(lastPosition) >= max) {
                this.openTransitionEndHandler();
            } else {
                el.addEventListener('transitionend', this.openTransitionEndHandler);
            }

            el.style.transform = 'translateX(' + Math.round(-max) + 'px)';
        }

        public toggleLeftAction(): void {
            if (this.opened) {
                this.closeAction();
            } else {
                this.openLeftAction();
            }
        }

        public toggleRightAction(): void {
            if (this.opened) {
                this.closeAction();
            } else {
                this.openRightAction();
            }
        }

        private onDragMove(e: TouchEvent): void {
            if (this.disabled) {
                return;
            }

            const el = this.contentEl as HTMLElement;
            const elActLeft = this.leftActionsEl as HTMLElement;
            const elActRight = this.rightActionsEl as HTMLElement;
            const delta = (e as any).touchmoveX - (e as any).touchstartX;

            // drag start
            if (!this.drag) {
                this.drag = true;
                this.dragLeft = this.openedLeft;
                this.dragRight = this.openedRight;
                this.dragStartPosition = getTargetPosition(el);
                this.maxDrag = new MaxDragAction(elActLeft.offsetWidth, elActRight.offsetWidth);
            }

            // drag
            el.style.transform = 'translateX(' + this.getDelta((this.dragStartPosition || 0) + delta) + 'px)';
        }

        private onDragEnd(e: TouchEvent): void {
            if (this.disabled) {
                return;
            }

            const el = this.contentEl as HTMLElement;
            const elActLeft = this.leftActionsEl as HTMLElement;
            const elActRight = this.rightActionsEl as HTMLElement;
            const lastPosition = getTargetPosition(el);

            (el.style as any)['user-select'] = '';
            this.drag = false;
            delete this.maxDrag;
            delete this.dragStartPosition;

            const width = lastPosition > 0 ? elActLeft.offsetWidth : elActRight.offsetWidth;
            const movement = Math.abs((this.opened ? -width : 0) + Math.abs(lastPosition));
            const openActionName = 'open' + (lastPosition > 0 ? 'Left' : 'Right') + 'Action';

            if ((movement / width) > 0.3) {
                if (this.opened) {
                    this.closeAction();
                } else {
                    this[openActionName]();
                }
            } else if (this.opened) {
                this[openActionName]();
            } else {
                this.closeAction();
            }
        }

        @Watch('disabled')
        private onDisabled(value: boolean): void {
            if (value) {
                this.closeAction();
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

            (this.contentEl as HTMLElement).removeEventListener('transitionend', this.closeTransitionEndHandler);
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
    }
</script>
