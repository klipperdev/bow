<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-img v-bind="this.$attrs" :src="lazyData">
        <template v-slot:placeholder>
            <slot name="placeholder"></slot>
        </template>

        <template v-slot:default>
            <slot name="default"></slot>
        </template>
    </v-img>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {Canceler} from '@klipper/http-client/Canceler';
    import {ContentConfig} from '../../api/ContentConfig';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KImg extends Vue {
        @Prop({type: String})
        public apiSrc: string;

        @Prop({type: String})
        public mode?: string;

        private lazyData: string = '';

        private isMounted: boolean = false;

        private previousRequest?: Canceler;

        @Watch('apiSrc')
        public async watchApiSrc(): Promise<void> {
            await this.loadLazyData();
        }

        @Watch('mode')
        public async watchMode(): Promise<void> {
            await this.loadLazyData();
        }

        @Watch('isMounted')
        public async watchIsMounted(): Promise<void> {
            await this.loadLazyData();
        }

        public async mounted(): Promise<void> {
            this.isMounted = true;
        }

        public async destroyed(): Promise<void> {
            if (this.previousRequest) {
                this.previousRequest.cancel();
                this.previousRequest = undefined;
            }
        }

        private async loadLazyData(): Promise<void> {
            if (this.previousRequest) {
                this.previousRequest.cancel();
                this.previousRequest = undefined;
            }

            if (this.apiSrc) {
                this.previousRequest = new Canceler();
                this.lazyData = await this.$downloader.downloadContent(this.$el, {
                    src: this.apiSrc,
                    mode: this.mode,
                } as ContentConfig, this.previousRequest);
            }
        }
    }
</script>
