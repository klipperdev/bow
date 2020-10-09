<!--
This file is part of the Runr package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div :disabled="disabled" :class="classes" v-touch="{move: onDragMove, end: onDragEnd}">
        <div class="k-swipe-item-actions left" ref="leftActions">
            <slot name="action-left"
                  :disabled="disabled"
                  :opened="opened"
                  :openedLeft="openedLeft"
                  :openedRight="openedRight"
                  :drag="drag"
                  :dragLeft="dragLeft"
                  :dragRight="dragRight"
                  :close="close"
                  :openLeft="openLeft"
                  :openRight="openRight"
                  :toggleLeft="toggleLeft"
                  :toggleRight="toggleRight"
            ></slot>
        </div>
        <div class="k-swipe-item-actions right" ref="rightActions">
            <slot name="action-right"
                  :disabled="disabled"
                  :opened="opened"
                  :openedLeft="openedLeft"
                  :openedRight="openedRight"
                  :drag="drag"
                  :dragLeft="dragLeft"
                  :dragRight="dragRight"
                  :close="close"
                  :openLeft="openLeft"
                  :openRight="openRight"
                  :toggleLeft="toggleLeft"
                  :toggleRight="toggleRight"
            ></slot>
        </div>
        <div :class="contentClasses" ref="content">
            <slot name="default"
                  :disabled="disabled"
                  :opened="opened"
                  :openedLeft="openedLeft"
                  :openedRight="openedRight"
                  :drag="drag"
                  :dragLeft="dragLeft"
                  :dragRight="dragRight"
                  :close="close"
                  :openLeft="openLeft"
                  :openRight="openRight"
                  :toggleLeft="toggleLeft"
                  :toggleRight="toggleRight"
            ></slot>
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

        private opened: boolean = false;

        private openedLeft: boolean = false;

        private openedRight: boolean = false;

        private drag: boolean = false;

        private dragLeft: boolean = false;

        private dragRight: boolean = false;

        private maxDrag: MaxDragAction|null = null;

        private dragStartPosition: number|null = null;

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

        public close(): void {
            const el = (this.$refs.content as HTMLElement);

            el.style.transform = '';
            el.addEventListener('transitionend', this.closeTransitionEndHandler);
            this.opened = false;
        }

        public openLeft(): void {
            if (this.disabled) {
                return;
            }

            const el = (this.$refs.content as HTMLElement);
            const max = (this.$refs.leftActions as HTMLElement).offsetWidth;
            const lastPosition = getTargetPosition(el);

            if (this.opened) {
                this.close();
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

        public openRight(): void {
            if (this.disabled) {
                return;
            }

            const el = (this.$refs.content as HTMLElement);
            const max = (this.$refs.rightActions as HTMLElement).offsetWidth;
            const lastPosition = getTargetPosition(el);

            if (this.opened) {
                this.close();
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

        @Watch('disabled')
        private watchDisabled(value: boolean): void {
            if (value) {
                this.close();
            }
        }

        private onDragMove(e: TouchEvent): void {
            if (this.disabled) {
                return;
            }

            const el = this.$refs.content as HTMLElement;
            const elActLeft = this.$refs.leftActions as HTMLElement;
            const elActRight = this.$refs.rightActions as HTMLElement;
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

        private onDragEnd(): void {
            if (this.disabled) {
                return;
            }

            const el = this.$refs.content as HTMLElement;
            const elActLeft = this.$refs.leftActions as HTMLElement;
            const elActRight = this.$refs.rightActions as HTMLElement;
            const lastPosition = getTargetPosition(el);

            (el.style as any)['user-select'] = '';
            this.drag = false;
            this.maxDrag = null;
            this.dragStartPosition = null;

            const width = lastPosition > 0 ? elActLeft.offsetWidth : elActRight.offsetWidth;
            const movement = Math.abs((this.opened ? -width : 0) + Math.abs(lastPosition));
            const openActionName = 'open' + (lastPosition > 0 ? 'Left' : 'Right');

            if ((movement / width) > 0.3) {
                if (this.opened) {
                    this.close();
                } else {
                    this[openActionName]();
                }
            } else if (this.opened) {
                this[openActionName]();
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

            (this.$refs.content as HTMLElement).removeEventListener('transitionend', this.closeTransitionEndHandler);
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
