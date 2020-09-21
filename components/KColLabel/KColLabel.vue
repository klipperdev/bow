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

            <v-scroll-y-transition mode="out-in" origin="left top">
                <v-col class="k-col-label-content" key="loading" v-if="isLoading">
                    <slot name="loading" :skeletonLoaderPropsValue="skeletonLoaderPropsValue">
                        <v-skeleton-loader
                            v-bind="skeletonLoaderPropsValue"
                        ></v-skeleton-loader>
                    </slot>
                </v-col>

                <v-col class="k-col-label-content" key="data" v-else>
                    <v-slide-y-reverse-transition mode="out-in">
                        <div class="k-col-label-content-wrapper" key="edit" v-if="editMode">
                            <slot name="edit"
                                  :label="label"
                                  :hideLabel="hideLabel"
                                  :labelColor="labelColor"
                                  :labelDarkColor="labelDarkColor"
                                  :vertical="vertical"
                                  :editMode="editMode"
                            ></slot>
                        </div>

                        <div class="k-col-label-content-wrapper" key="read" v-else>
                            <slot name="view"
                                  :label="label"
                                  :hideLabel="hideLabel"
                                  :labelColor="labelColor"
                                  :labelDarkColor="labelDarkColor"
                                  :vertical="vertical"
                                  :editMode="editMode"
                            >
                                <slot name="default"
                                      :label="label"
                                      :hideLabel="hideLabel"
                                      :labelColor="labelColor"
                                      :labelDarkColor="labelDarkColor"
                                      :vertical="vertical"
                                      :editMode="editMode"
                                ></slot>
                            </slot>
                        </div>
                    </v-slide-y-reverse-transition>
                </v-col>
            </v-scroll-y-transition>
        </v-row>
    </v-col>
</template>

<script lang="ts">
    import {Component, Prop} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {inject as RegistrableInject} from '@klipper/bow/mixins/Registrable';
    import KLoaderWrapper from '@klipper/bow/components/KLoaderWrapper/KLoaderWrapper.vue';
    import {randomNumberBetween} from '@klipper/bow/utils/number';
    import '@klipper/bow/components/KColLabel/KColLabel.scss';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KColLabel extends mixins(RegistrableInject<KLoaderWrapper, any>('loaderWrapper')) {
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

        @Prop({type: Boolean, default: false})
        public loading: boolean;

        @Prop({type: Object, default: undefined})
        public colProps!: object|undefined;

        @Prop({type: Object, default: undefined})
        public skeletonLoaderProps!: object;

        /**
         * Content width average used to create the skeleton loader
         */
        @Prop({type: String, default: 'random'})
        public contentWidth!: string|undefined;

        private dynamicLoading: boolean = false;

        public get isLoading(): boolean {
            return this.loading || this.dynamicLoading;
        }

        public get colPropsValue(): object {
            return Object.assign({cols: 12, sm: 6}, this.colProps || {});
        }

        public get skeletonLoaderPropsValue(): object {
            let contentWidth = this.contentWidth || undefined;

            if ('random' === contentWidth) {
                contentWidth = randomNumberBetween(30, 80) + '%';
            }

            return Object.assign(
                {class:'mt-1', type: 'text', width: contentWidth},
                this.skeletonLoaderProps || {}
            );
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

        public created(): void {
            if ((this as any).loaderWrapper) {
                (this as any).loaderWrapper.register(this);
            }
        }

        public beforeDestroy(): void {
            if ((this as any).loaderWrapper) {
                (this as any).loaderWrapper.unregister(this);
            }
        }

        public setLoading(loading: boolean): void {
            this.dynamicLoading = loading;
        }
    }
</script>
