<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div
        :class="classes"
    >
        <v-img
            v-bind="$attrs"
            :src="lazyData"
            :key="apiSrc"
        >
            <template v-slot:placeholder>
                <slot name="placeholder" :loaded="isLoaded"/>
            </template>

            <template v-slot:default>
                <slot
                    name="default"
                    :loaded="isLoaded"
                />
            </template>
        </v-img>
    </div>
</template>

<style lang="scss" src="./KImg.scss" />

<script lang="ts">
import {ContentConfig} from '@klipper/bow/api/ContentConfig';
import {OnlineCheckable} from '@klipper/bow/mixins/OnlineCheckable';
import {Canceler} from '@klipper/http-client/Canceler';
import {CancelerBag} from '@klipper/http-client/CancelerBag';
import {mixins} from 'vue-class-component';
import {Component, Prop, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KImg extends mixins(
    OnlineCheckable,
) {
    @Prop({type: String})
    public apiSrc: string;

    @Prop({type: String})
    public mode?: string;

    private lazyData: string = '';

    private isMounted: boolean = false;

    private loading: boolean = false;

    private previousRequests: CancelerBag = new CancelerBag();

    private get isAuthenticated(): boolean {
        return this.$store && this.$store.state.auth.authenticated;
    }

    private get classes(): object {
        return {
            'k-img': true,
            'k-img-container': 'cover' !== this.mode,
            'k-img-cover': 'cover' === this.mode,
            'k-img-empty': !this.lazyData && !!this.apiSrc && !this.loading,
        };
    }

    private get isLoaded(): boolean {
        return '' !== this.lazyData;
    }

    public async beforeCreate(): Promise<void> {
        this.isMounted = false;
    }

    public async mounted(): Promise<void> {
        this.isMounted = true;
    }

    public async destroyed(): Promise<void> {
        this.previousRequests.cancelAll();
    }

    private async loadLazyData(): Promise<void> {
        this.previousRequests.cancelAll();

        if (this.apiSrc) {
            const canceler = new Canceler();
            this.previousRequests.add(canceler);

            try {
                this.loading = true;
                this.lazyData = '';
                this.lazyData = await this.$downloader.downloadContent((this.$el as HTMLElement), {
                    src: this.apiSrc,
                    mode: this.mode,
                } as ContentConfig, canceler);
                this.previousRequests.remove(canceler);
                this.loading = false;
            } catch (e) {
                this.previousRequests.remove(canceler);
                this.loading = false;
            }
        } else {
            this.lazyData = '';
        }
    }

    @Watch('apiSrc')
    @Watch('mode')
    @Watch('isMounted')
    @Watch('isAuthenticated')
    private watchToLoadLazyData(): void {
        if (this.isMounted
                && this.isAuthenticated
                && !this.isLoaded
                && !this.loading
                && 0 === this.previousRequests.all().length) {
            this.loadLazyData().then();
        }
    }

    @Watch('online')
    private watchOnlineToRetryLazyLoad(online: boolean): void {
        if (online && !this.isLoaded && !this.loading) {
            this.loadLazyData().then();
        }
    }
}
</script>
