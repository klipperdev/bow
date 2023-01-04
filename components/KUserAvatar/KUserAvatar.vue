<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div
        class="k-user-avatar"
    >
        <slot
            v-if="loading"
            name="loading"
        >
            <div
                class="k-user-avatar-skeleton-loader"
            >
                <v-skeleton-loader
                    type="avatar"
                    :width="size"
                    :height="size"
                    :class="imgClasses"
                    :style="imgStyles"
                ></v-skeleton-loader>

                <v-skeleton-loader
                    v-if="label"
                    type="text"
                    :width="skeletonWidth"
                    class="ml-2"
                ></v-skeleton-loader>
            </div>
        </slot>

        <v-avatar
            v-else
            :id="'userAvatar_' + _uid"
            :class="imgClasses"
            :style="imgStyles"
            :size="size"
            :color="color"
            dark
        >
            <v-fade-transition
                mode="out-in"
            >
                <k-img
                    v-if="imageUrl"
                    :api-src="imageUrl"
                    :key="imageUrl"
                    mode="cover"
                >
                    <template v-slot:default="{loaded}">
                        <v-row
                            v-if="!loaded"
                            class="fill-height ma-0"
                            align="center"
                            justify="center"
                        >
                            <span
                                v-if="alias"
                                :class="aliasClasses"
                                :style="'font-size: ' + aliasSize + ';'"
                            >
                                {{ alias }}
                            </span>

                            <span
                                v-else-if="initial"
                                :class="initialClasses"
                                :style="'font-size: ' + initialSize + ';'"
                            >
                                {{ initial }}
                            </span>

                            <v-icon
                                v-else-if="!user"
                                small
                                dark
                            >
                                fa-fw fa-user-slash
                            </v-icon>

                            <v-icon
                                v-else
                                small
                                dark
                            >
                                fa-fw fa-user
                            </v-icon>
                        </v-row>
                    </template>
                </k-img>

                <span
                    v-else-if="alias"
                    :class="aliasClasses"
                    :style="'font-size: ' + aliasSize + ';'"
                >
                    {{ alias }}
                </span>

                <span
                    v-else-if="initial"
                    :class="aliasClasses"
                    :style="'font-size: ' + initialSize + ';'"
                >
                    {{ initial }}
                </span>

                <v-icon
                    v-else-if="!user"
                    small
                    dark
                >
                    fa-fw fa-user-slash
                </v-icon>

                <v-icon
                    v-else
                    small
                    dark
                >
                    fa-fw fa-user
                </v-icon>
            </v-fade-transition>
        </v-avatar>

        <slot
            name="label"
            v-bind="$attrs"
        >
            <span
                v-if="label && !!tooltipContent"
                class="ml-2"
            >
                {{ tooltipContent }}
            </span>
        </slot>

        <v-tooltip
            :activator="'#userAvatar_' + _uid"
            :left="left"
            :right="right"
            :top="top"
            :bottom="bottom"
            :nudge-left="left ? tooltipNudge : 0"
            :nudge-right="right ? tooltipNudge : 0"
            :nudge-top="top ? tooltipNudge : 0"
            :nudge-bottom="bottom ? tooltipNudge : 0"
            :open-delay="tooltipOpenDelay"
            :disabled="tooltipDisabled"
            :transition="tooltipTransitionValue"
            :color="color"
            :content-class="tooltipClasses"
        >
            <span>
                {{ tooltipContent }}
            </span>
        </v-tooltip>
    </div>
</template>

<style lang="scss" src="./KUserAvatar.scss" />

<script lang="ts">
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {randomNumberBetween} from '@klipper/bow/utils/number';
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KUserAvatar extends Vue {
    @Prop({type: Object})
    public user!: Dictionary<any>;

    @Prop({type: Number, default: 48})
    public size!: number;

    @Prop({type: String, default: 'accent'})
    public color!: string;

    @Prop({type: String, default: 'white'})
    public textColor!: string;

    @Prop({type: Boolean, default: false})
    public loading!: boolean;

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

    @Prop({type: [Boolean, String], default: true})
    public emptyMessage!: boolean|string;

    @Prop({type: Number, default: 8})
    public tooltipNudge!: number;

    @Prop({type: Number, default: 220})
    public tooltipOpenDelay!: number;

    @Prop({type: String, default: 'slide'})
    public tooltipTransition!: string;

    @Prop({type: String})
    public imgClass!: string|undefined;

    @Prop({type: Object})
    public imgStyle!: object|undefined;

    @Prop({type: [String, Boolean]})
    public verticalAdjust!: string|boolean|undefined;

    private tooltipDisabled: boolean = false;

    protected get skeletonWidth(): string {
        return randomNumberBetween(30, 60) + '%';
    }

    private get imgClasses(): Dictionary<boolean> {
        const classes = {} as Dictionary<boolean>;

        if (this.imgClass) {
            classes[this.imgClass] = true;
        }

        return classes;
    }

    private get imgStyles(): Dictionary<string> {
        const styles = {} as any;

        if ('' === this.verticalAdjust) {
            styles.marginTop = Math.floor(this.size / 6) * -1 + 'px';
        } else if (this.verticalAdjust) {
            styles.marginTop = this.verticalAdjust as string;
        }

        Object.assign(styles, this.imgStyle);

        return styles;
    }

    private get tooltipClasses(): string {
        return this.textColorText;
    }

    private get aliasClasses(): Dictionary<any> {
        const classes = {
            'k-user-avatar-alias': true,
        };
        classes[this.textColorText] = true;

        return classes;
    }

    private get initialClasses(): Dictionary<any> {
        const classes = {
            'k-user-avatar-initial': true,
        };
        classes[this.textColorText] = true;

        return classes;
    }

    private get textColorText(): string {
        return this.textColor + '--text';
    }

    private get imageUrl(): string|undefined {
        return this.user && this.user.image_url
            ? this.user.image_url
            : undefined;
    }

    private get alias(): string|undefined {
        return this.user && this.user.alias
            ? this.user.alias
            : undefined;
    }

    private get initial(): string|undefined {
        return this.user && this.user.initial
            ? this.user.initial
            : undefined;
    }

    private get aliasSize(): string {
        return this.size ? (Math.round(this.size / 3.5)) + 'px' : '';
    }

    private get initialSize(): string {
        return this.size ? (Math.round(this.size / 2.8)) + 'px' : '';
    }

    private get tooltipContent(): string|undefined {
        if (this.user) {
            if (this.user.full_name) {
                return this.user.full_name;
            }

            if (this.user.first_name || this.user.last_name) {
                return (this.user.first_name + ' ' + this.user.last_name).trim();
            }

            if (this.user.username) {
                return this.user.username;
            }

            if (this.user.id) {
                return this.user.id;
            }

            return undefined;
        } else if (!this.loading && false !== this.emptyMessage) {
            if (typeof this.emptyMessage === 'string') {
                return this.emptyMessage;
            }

            return this.$t('component.user-avatar.empty') as string;
        }

        return undefined;
    }

    private get tooltipTransitionValue(): string|undefined {
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

    private get isTooltipDisabled(): boolean {
        return !this.tooltip || !this.tooltipContent || this.label;
    }


    public mounted(): void {
        this.watchIsTooltipDisabled(this.isTooltipDisabled);
    }

    @Watch('isTooltipDisabled')
    private watchIsTooltipDisabled(disabled: boolean): void {
        this.tooltipDisabled = disabled;
    }
}
</script>
