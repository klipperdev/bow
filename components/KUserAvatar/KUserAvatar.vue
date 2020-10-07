<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div class="k-user-avatar">
        <v-avatar :id="'userAvatar_' + _uid"
                  :class="imgClasses"
                  :style="imgStyles"
                  :size="size"
                  :color="color"
                  dark
        >
            <v-fade-transition mode="out-in">
                <k-img v-if="imageUrl"
                       :api-src="imageUrl"
                       mode="cover"
                >
                    <template v-slot:default="{loaded}">
                        <v-row v-if="!loaded"
                               class="fill-height ma-0"
                               align="center"
                               justify="center"
                        >
                            <span v-if="alias"
                                  class="k-user-avatar-alias white--text"
                                  :style="'font-size: ' + aliasSize + ';'"
                            >
                                {{ alias }}
                            </span>

                            <span v-else-if="initial"
                                  class="k-user-avatar-initial white--text"
                                  :style="'font-size: ' + initialSize + ';'"
                            >
                                {{ initial }}
                            </span>

                            <v-icon v-else small dark>fa fa-fw fa-user</v-icon>
                        </v-row>
                    </template>
                </k-img>

                <span v-else-if="alias"
                      class="k-user-avatar-alias white--text"
                      :style="'font-size: ' + aliasSize + ';'"
                >
                    {{ alias }}
                </span>

                <span v-else-if="initial"
                      class="k-user-avatar-initial white--text"
                      :style="'font-size: ' + initialSize + ';'"
                >
                    {{ initial }}
                </span>

                <v-icon v-else small dark>fa fa-fw fa-user</v-icon>
            </v-fade-transition>
        </v-avatar>

        <slot name="label" v-bind="$attrs">
            <span class="ml-2" v-if="label && !!tooltipContent">{{ tooltipContent }}</span>
        </slot>

        <v-tooltip :activator="'#userAvatar_' + _uid"
                   :left="left"
                   :right="right"
                   :top="top"
                   :bottom="bottom"
                   :nudge-left="left ? tooltipNudge : 0"
                   :nudge-right="right ? tooltipNudge : 0"
                   :nudge-top="top ? tooltipNudge : 0"
                   :nudge-bottom="bottom ? tooltipNudge : 0"
                   :open-delay="tooltipOpenDelay"
                   eager
                   :disabled="tooltipDisabled"
                   :transition="tooltipTransitionValue"
                   :color="color"
        >
            <span>{{ tooltipContent }}</span>
        </v-tooltip>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import '@klipper/bow/components/KUserAvatar/KUserAvatar.scss';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KUserAvatar extends Vue {
        @Prop({type: Object})
        public user!: Partial<any>;

        @Prop({type: Number, default: 48})
        public size!: number;

        @Prop({type: String, default: 'accent'})
        public color!: string;

        @Prop({type: Boolean, default: true})
        public tooltip!: boolean;

        @Prop({type: Boolean, default: false})
        public label!: boolean;

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

        @Prop({type: String, default: undefined})
        public imgClass!: string;

        @Prop({type: Object, default: undefined})
        public imgStyle!: object;

        @Prop({type: String|Boolean, default: undefined})
        public verticalAdjust!: string|boolean;

        private tooltipDisabled: boolean = false;

        public get imgClasses(): object {
            const classes = {};

            if (this.imgClass) {
                classes[this.imgClass] = true;
            }

            return classes;
        }

        public get imgStyles(): object {
            const styles = {} as any;

            if ('' === this.verticalAdjust) {
                styles.marginTop = Math.floor(this.size / 6) * -1 + 'px';
            } else if (this.verticalAdjust) {
                styles.marginTop = this.verticalAdjust as string;
            }

            Object.assign(styles, this.imgStyle);

            return styles;
        }

        public get imageUrl(): string|undefined {
            return this.user && this.user.image_url
                ? this.user.image_url
                : undefined;
        }

        public get alias(): string|undefined {
            return this.user && this.user.alias
                ? this.user.alias
                : undefined;
        }

        public get initial(): string|undefined {
            return this.user && this.user.initial
                ? this.user.initial
                : undefined;
        }

        public get aliasSize(): string {
            return this.size ? (Math.round(this.size / 3.5)) + 'px' : ''
        }

        public get initialSize(): string {
            return this.size ? (Math.round(this.size / 2.8)) + 'px' : ''
        }

        public get tooltipContent(): string|undefined {
            if (this.user) {
                if (this.user.full_name) {
                    return this.user.full_name;
                }

                if (this.user.first_name || this.user.last_name) {
                    return (this.user.first_name + ' ' + this.user.last_name).trim();
                }
            }

            return undefined;
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
            return !this.tooltip || !this.tooltipContent || this.label;
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
