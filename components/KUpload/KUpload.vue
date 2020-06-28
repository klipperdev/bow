<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div :id="uploaderId" :class="classes" :key="uploaderId">
        <slot name="default"
              :inline="inline"
              :open="openModal"
        ></slot>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import Uppy from '@uppy/core';
    import Dashboard, {DashboardOptions} from '@uppy/dashboard';
    import XHRUpload from '@uppy/xhr-upload';
    import {MapKey} from '@klipper/http-client/models/MapKey';
    import {deepMerge} from '../../utils/object';
    import '@uppy/core/dist/style.css';
    import '@uppy/dashboard/dist/style.css';
    import './KUpload.scss';

    /**
     *
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KUpload extends Vue {
        @Prop({type: String, required: true})
        public endpoint: string;

        @Prop({type: Boolean, default: false})
        public inline: boolean;

        @Prop({type: Boolean, default: undefined})
        public autoProceed?: boolean;

        @Prop({type: Number, default: 5242880})
        public maxFileSize: number;

        @Prop({type: Number, default: 1})
        public minNumberOfFiles: number;

        @Prop({type: Number, default: 1})
        public maxNumberOfFiles: number;

        @Prop({type: Boolean, default: undefined})
        public allowMultipleUploads?: boolean;

        @Prop({type: Array, default: undefined})
        public allowedFileTypes?: string[];

        @Prop({type: Boolean, default: true})
        public disableInformer: boolean;

        @Prop({type: Number, default: 1})
        public maxParallelUpload: number;

        @Prop({type: String, default: '100%'})
        public width: string;

        @Prop({type: String, default: '200px'})
        public height: string;

        public get classes(): object {
            return {
                'k-upload': true,
                'k-upload-inline': this.inline,
            };
        }

        private uppy?: Uppy.Uppy;

        public get uploaderId(): string {
            return 'k-upload-' + (this.inline ? 'inline-' : '') + (this as Partial<any>)._uid;
        }

        public get locale(): string {
            return this.$uploader.locale;
        }

        @Watch('locale')
        private watchLocale(): void {
            this.destroyUppy();
            this.createUppy();
            this.configureUppy();
        }

        public created(): void {
            this.createUppy();
        }

        public mounted(): void {
            this.configureUppy();
        }

        public destroyed(): void {
            this.destroyUppy();
        }

        public beforeUpdate(): void {
            this.destroyUppy();
        }

        public updated(): void {
            this.createUppy();
            this.configureUppy();
        }

        private openModal(): void {
            (this.uppy.getPlugin('Dashboard') as Dashboard).openModal();
        }

        private createUppy(): void {
            this.uppy = this.$uploader.create({
                id: this.uploaderId,
                restrictions: {
                    maxFileSize: this.maxFileSize,
                    minNumberOfFiles: this.minNumberOfFiles,
                    maxNumberOfFiles: this.maxNumberOfFiles,
                    allowedFileTypes: this.allowedFileTypes,
                },
                allowMultipleUploads: undefined !== this.allowMultipleUploads
                    ? this.allowMultipleUploads
                    : (this.maxNumberOfFiles > 1),
                autoProceed: undefined !== this.autoProceed
                    ? this.autoProceed
                    : (1 === this.maxNumberOfFiles),
            });

            this.uppy.on('complete', async (result) => {
                if (0 === result.failed.length) {
                    this.uppy.reset();
                    this.$emit('complete', result);
                } else {
                    let authFailure = false;

                    for (const failUpload of result.failed) {
                        if (failUpload.response && 401 === failUpload.response.status) {
                            authFailure = true;
                            break;
                        }
                    }

                    if (authFailure) {
                        await this.$uploader.refreshAuth(true);
                        (this.uppy.getPlugin('XHRUpload') as XHRUpload)
                            .opts.headers = this.getRequestHeaders();

                        for (const failUpload of result.failed) {
                            await this.uppy.retryUpload(failUpload.id);
                        }
                    }
                }
            });
        }

        private configureUppy(): void {
            const dashboardConfig = {
                proudlyDisplayPoweredByUppy: false,
                showLinkToFileUploadResult: false,
                disableInformer: this.disableInformer,
                theme: this.$uploader.isDark,
            } as DashboardOptions;

            if (this.inline) {
                deepMerge(dashboardConfig, {
                    inline: true,
                    target: '#' + this.uploaderId,
                    replaceTargetContent: true,
                    width: this.width,
                    height: this.height,
                } as DashboardOptions);
            } else {
                deepMerge(dashboardConfig, {
                    closeAfterFinish: true,
                } as DashboardOptions);
            }

            this.uppy.use(Dashboard, dashboardConfig);

            this.uppy.use(XHRUpload, {
                endpoint: this.endpoint,
                limit: this.maxParallelUpload,
                headers: this.getRequestHeaders(),
            });
        }

        private destroyUppy(): void {
            if (this.uppy) {
                this.uppy.close();
                this.uppy = undefined;
            }
        }

        private getRequestHeaders(): MapKey<string> {
            return this.$uploader.addAuthorizationHeader({
                'Accept': 'application/json',
            });
        }
    }
</script>