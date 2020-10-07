<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-avatar :id="'choiceAvatar_' + _uid"
              rounded
              :size="size"
              :color="$oc(choice).color(defaultColor)"
    >
        <span class="white--text" :style="'font-size: ' + labelSize + ';'">
            <slot name="default" :label="$oc(choice).label()" :default-label="defaultLabel">
                {{ labelContent }}
            </slot>
        </span>

        <v-tooltip :activator="'#choiceAvatar_' + _uid"
                   :left="left"
                   :right="right"
                   :top="!top && !bottom && !left && !right ? true : top"
                   :bottom="bottom"
                   :nudge-left="left ? tooltipNudge : 0"
                   :nudge-right="right ? tooltipNudge : 0"
                   :nudge-top="top ? tooltipNudge : 0"
                   :nudge-bottom="bottom ? tooltipNudge : 0"
                   :open-delay="tooltipOpenDelay"
                   eager
                   :disabled="tooltipDisabled"
                   :transition="tooltipTransitionValue"
                   :color="$oc(choice).color(defaultColor)"
        >
            <slot name="tooltip" :tooltip="tooltipContent" :label="$oc(choice).label()" :default-label="defaultLabel">
                <span>{{ tooltipContent }}</span>
            </slot>
        </v-tooltip>
    </v-avatar>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KChoiceAvatar extends Vue {
        @Prop({type: String, default: 'grey lighten-1'})
        public defaultColor!: string;

        @Prop({type: String, default: '~'})
        public defaultLabel!: string;

        @Prop({type: Object|undefined, default: undefined, required: true})
        public choice!: object|undefined;

        @Prop({type: Number, default: 28})
        public size!: number;

        @Prop({type: Boolean, default: true})
        public tooltip!: boolean;

        @Prop({type: Boolean, default: false})
        public right!: boolean;

        @Prop({type: Boolean, default: false})
        public left!: boolean;

        @Prop({type: Boolean, default: false})
        public top!: boolean;

        @Prop({type: Boolean, default: false})
        public bottom!: boolean;

        @Prop({type: Number, default: 8})
        public tooltipNudge!: number;

        @Prop({type: Number, default: 220})
        public tooltipOpenDelay!: number;

        @Prop({type: String, default: 'slide'})
        public tooltipTransition!: string;

        private tooltipDisabled: boolean = false;

        public get labelContent(): string {
            const value = this.$oc(this.choice).label();

            if (typeof value === 'string' && value) {
                return (value as string).substr(0, 2).trim();
            }

            return this.defaultLabel;
        }

        public get labelSize(): string {
            return this.size ? (Math.round(this.size / 2)) + 'px' : '';
        }

        public get tooltipContent(): string|undefined {
            return this.$oc(this.choice).label();
        }

        public get tooltipTransitionValue(): string|undefined {
            if ('slide' === this.tooltipTransition) {
                if (this.left) {
                    return 'slide-x-reverse-transition';
                }

                if (this.right) {
                    return 'slide-x-transition';
                }

                if (this.top) {
                    return 'slide-y-reverse-transition';
                }

                if (this.bottom) {
                    return 'slide-y-transition';
                }
            }

            return undefined;
        }

        public get isTooltipDisabled(): boolean {
            return !this.tooltip || !this.tooltipContent;
        }

        @Watch('isTooltipDisabled')
        public watchIsTooltipDisabled(disabled: boolean) :void {
            this.tooltipDisabled = disabled;
        }

        public mounted(): void {
            this.watchIsTooltipDisabled(this.isTooltipDisabled);
        }
    }
</script>
