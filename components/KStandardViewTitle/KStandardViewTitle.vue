<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-fade-transition mode="out-in">
        <div key="loading" v-if="isLoading" class="flex-grow-1">
            <slot name="loading">
                <v-skeleton-loader
                    v-bind="skeletonLoaderPropsValue"
                ></v-skeleton-loader>
            </slot>
        </div>

        <div key="title" :class="classes" v-bind="$attrs" v-on="$listeners" v-else>
            <slot name="default" :loading="isLoading"></slot>
        </div>
    </v-fade-transition>
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
    export default class KStandardViewTitle extends mixins(RegistrableInject<KLoaderWrapper, any>('loaderWrapper')) {
        @Prop({type: String, default: 'primary--text'})
        public color: string;

        @Prop({type: String, default: 'text--lighten-3'})
        public darkColor: string;

        @Prop({type: Boolean, default: false})
        public loading: boolean;

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

        public get skeletonLoaderPropsValue(): object {
            let contentWidth = this.contentWidth || undefined;

            if ('random' === contentWidth) {
                contentWidth = randomNumberBetween(30, 80) + '%';
            }

            return Object.assign(
                {type: 'heading', width: contentWidth},
                this.skeletonLoaderProps || {}
            );
        }

        public get classes(): object {
            return this.$classes({
                'text-h6': true,
                'flex-grow-1': true,
                [this.color]: true,
            }, {
                [this.darkColor]: true,
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
