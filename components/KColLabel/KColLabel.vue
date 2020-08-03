<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-col v-bind="colPropsValue">
        <v-row :class="rowClasses">
            <v-col cols="12" md="4" :class="labelClasses" v-if="!hideLabel">
                <slot name="label">
                    <span>{{ label }}</span>
                </slot>
            </v-col>

            <v-col class="k-col-label-content" key="read" v-if="useDefaultSlot">
                <slot name="default"></slot>
            </v-col>

            <v-slide-y-reverse-transition mode="out-in" v-else>
                <v-col class="k-col-label-content" key="read" v-if="!editMode">
                    <slot name="view"
                          :label="label"
                          :hideLabel="hideLabel"
                          :labelColor="labelColor"
                          :labelDarkColor="labelDarkColor"
                          :vertical="vertical"
                          :editMode="editMode"
                    ></slot>
                </v-col>

                <v-col class="k-col-label-content" key="edit" v-else>
                    <slot name="edit"
                          :label="label"
                          :hideLabel="hideLabel"
                          :labelColor="labelColor"
                          :labelDarkColor="labelDarkColor"
                          :vertical="vertical"
                          :editMode="editMode"
                    ></slot>
                </v-col>
            </v-slide-y-reverse-transition>
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

        @Prop({type: Boolean, default: false})
        public editMode: boolean;

        @Prop({type: Object, default: undefined})
        public colProps!: object|undefined;

        public get colPropsValue(): object {
            return Object.assign({cols: 12, sm: 6}, this.colProps || {});
        }

        public get useDefaultSlot(): boolean {
            return undefined === this.$slots.view && undefined === this.$slots.edit;
        }

        public get rowClasses(): object {
            return {
                'k-col-label-row': true,
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
