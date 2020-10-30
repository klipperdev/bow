<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div :class="classes">
        <v-card-actions>
            <slot name="actions" :show="show">
                <v-slide-y-transition mode="out-in">
                    <span :class="titleClasses" v-if="!!title">{{ title }}</span>
                </v-slide-y-transition>
            </slot>

            <v-spacer></v-spacer>

            <v-scale-transition mode="out-in" origin="center center">
                <v-btn v-if="!locked && show"
                       key="up"
                       icon
                       x-small
                       ripple
                       @click="show = !show"
                >
                    <v-icon x-small>fa fa-chevron-up</v-icon>
                </v-btn>

                <v-btn v-else-if="!locked"
                       key="down"
                       icon
                       x-small
                       ripple
                       @click="show = !show"
                >
                    <v-icon x-small>fa fa-chevron-down</v-icon>
                </v-btn>
            </v-scale-transition>
        </v-card-actions>

        <v-divider v-if="showDivider && show"></v-divider>

        <v-expand-transition>
            <div v-show="show" :class="contentClasses">
                <slot name="default" :show="show"></slot>
            </div>
        </v-expand-transition>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import '@klipper/bow/components/KCardSection/KCardSection.scss';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KCardSection extends Vue {
        @Prop({type: String, default: null})
        public title!: string;

        @Prop({type: Boolean, default: false})
        public close!: boolean;

        @Prop({type: Boolean, default: false})
        public locked: boolean;

        @Prop({type: Boolean, default: true})
        public divider: boolean;

        @Prop({type: Boolean, default: false})
        public dense: boolean;

        @Prop({type: Boolean, default: false})
        public noContainer: boolean;

        private show: boolean = false;

        private previousValue: boolean|null = null;

        public get classes(): object {
            return {
                'k-card-section': true,
                'dense': this.dense,
            };
        }

        public get titleClasses(): object {
            return {
                'text-subtitle-2': true,
                'accent--text': true,
                'text--lighten-2': this.$store.state.darkMode.enabled,
            };
        }

        public get contentClasses(): object {
            return {
                'k-card-section--content': true,
                'container': !this.noContainer,
                'fluid': !this.noContainer,
            };
        }

        public get showDivider(): boolean {
            return this.title ? this.divider : false;
        }

        public created(): void {
            this.updateShowValue();
        }

        public mounted(): void {
            this.updateShowValue();
        }

        private updateShowValue(): void {
            this.show = this.locked || (!this.locked && !this.close);
        }

        @Watch('locked')
        private watchLocked(locked: boolean): void {
            if (locked) {
                this.previousValue = this.show;
                this.updateShowValue();
            } else if (null !== this.previousValue) {
                this.show = this.previousValue;
                this.previousValue = null;
            }
        }
    }
</script>
