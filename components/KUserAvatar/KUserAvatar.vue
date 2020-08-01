<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-tooltip :left="left"
               :right="right"
               :top="top"
               :bottom="bottom"
               :nudge-left="left ? tooltipNudge : 0"
               :nudge-right="right ? tooltipNudge : 0"
               :nudge-top="top ? tooltipNudge : 0"
               :nudge-bottom="bottom ? tooltipNudge : 0"
               :open-delay="tooltipOpenDelay"
               eager
               :disabled="!tooltip || !tooltipContent"
               :transition="tooltipTransitionValue"
               :color="color"
    >
        <template v-slot:activator="{on, attrs}">
            <v-avatar v-on="on"
                      :class="imgClasses"
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

                                <span v-else
                                      class="k-user-avatar-initial white--text"
                                      :style="'font-size: ' + initialSize + ';'"
                                >
                                    {{ initial }}
                                </span>
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

                    <v-icon v-else small>fa fa-fw fa-user</v-icon>
                </v-fade-transition>
            </v-avatar>
        </template>

        <span>{{ tooltipContent }}</span>
    </v-tooltip>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import './KUserAvatar.scss';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KUserAvatar extends Vue {
        @Prop({type: Object})
        public user!: Partial<any>;

        @Prop({type: Number, default: 48})
        public size!: number;

        @Prop({type: String, default: 'primary'})
        public color!: string;

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

        @Prop({type: String, default: undefined})
        public imgClass!: string;

        public get imgClasses(): object {
            const classes = {};

            if (this.imgClass) {
                classes[this.imgClass] = true;
            }

            return classes;
        }

        public get imageUrl(): string|undefined {
            return this.user && this.user.profile && this.user.profile.image_url
                ? this.user.profile.image_url
                : undefined;
        }

        public get alias(): string|undefined {
            return this.user && this.user.alias
                ? this.user.alias
                : undefined;
        }

        public get initial(): string|undefined {
            return this.user && this.user.profile && this.user.profile.initial
                ? this.user.profile.initial
                : undefined;
        }

        public get aliasSize(): string {
            return this.size ? (Math.round(this.size / 3.5)) + 'px' : ''
        }

        public get initialSize(): string {
            return this.size ? (Math.round(this.size / 2.8)) + 'px' : ''
        }

        public get tooltipContent(): string|undefined {
            if (this.user && this.user.profile) {
                if (this.user.profile.full_name) {
                    return this.user.profile.full_name;
                }

                if (this.user.profile.first_name || this.user.profile.last_name) {
                    return (this.user.profile.first_name + ' ' + this.user.profile.last_name).trim();
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
    }
</script>