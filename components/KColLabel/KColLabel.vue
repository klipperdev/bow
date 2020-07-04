<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-col cols="12" sm="6">
        <v-row :class="rowClasses">
            <v-col cols="12" md="4" :class="labelClasses" v-if="!hideLabel">
                <slot name="label">
                    <span>{{ label }}</span>
                </slot>
            </v-col>

            <v-col class="k-col-label-content">
                <slot name="default"></slot>
            </v-col>
        </v-row>
    </v-col>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import './KColLabel.scss';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KColLabel extends Vue {
        @Prop({type: String})
        public label?: string;

        @Prop({type: Boolean, default: false})
        public hideLabel: boolean;

        @Prop({type: String, default: 'primary--text'})
        public labelColor: string;

        @Prop({type: String, default: 'text--lighten-3'})
        public labelDarkColor: string;

        @Prop({type: Boolean, default: false})
        public vertical: boolean;

        public get rowClasses(): object {
            return {
                'k-col-label-vertical': this.vertical,
            };
        }

        public get labelClasses(): object {
            return this.$classes({
                'k-col-label': true,
                'font-weight-bold': true,
                'word-break-word': true,
                'text-md-right': true,
                [this.labelColor]: true,
            }, {
                [this.labelDarkColor]: true,
            });
        }
    }
</script>
