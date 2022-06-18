<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-dialog
        eager
        v-bind="genDialogProps"
        v-model="open"
        max-width="900"
        persistent
        transition=""
    >
        <template v-slot:activator="{attrs, on}">
            <slot
                name="dialog-activator"
                :attrs="attrs"
                :on="on"
            />
        </template>

        <v-card>
            <v-card-title
                :class="$classes('primary--text', 'text--lighten-2')"
            >
                <slot
                    name="wizard-title"
                >
                    {{ $ml('import') }}
                </slot>
            </v-card-title>

            <v-slide-x-transition mode="out-in">
                <v-card-text
                    v-if="step === 'complete'"
                    key="complete"
                >
                    <v-alert
                        :type="completeAlertType"
                    >
                        {{ 'success' === completeAlertType ? $t('component.import.message.success') : completeAlertErrorMessage }}
                    </v-alert>

                    <k-card-section locked>
                        <v-row>
                            <k-col-label
                                :label="$mfl('import', 'total_count')"
                                single
                                :empty="false"
                            >
                                <k-number
                                    :value="$oc(importData).total_count(0)"
                                    :scale="0"
                                />
                            </k-col-label>
                        </v-row>

                        <v-row>
                            <k-col-label
                                :label="$mfl('import', 'success_count')"
                                single
                                :empty="false"
                            >
                                <k-number
                                    :value="$oc(importData).success_count(0)"
                                    :scale="0"
                                />
                            </k-col-label>
                        </v-row>

                        <v-row>
                            <k-col-label
                                :label="$mfl('import', 'error_count')"
                                single
                                :empty="false"
                            >
                                <k-number
                                    :value="$oc(importData).error_count(0)"
                                    :scale="0"
                                />
                            </k-col-label>
                        </v-row>
                    </k-card-section>

                    <v-container fluid>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-btn
                                    color="accent"
                                    x-large
                                    depressed
                                    block
                                    :disabled="loading || !$oc(importData).original_file_url()"
                                    @click="downloadFile($oc(importData).original_file_url())"
                                >
                                    <v-icon left>fa-fw fa-file-download</v-icon>
                                    {{ $t('component.import.button.download_original_file') }}
                                </v-btn>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-btn
                                    color="accent"
                                    x-large
                                    depressed
                                    block
                                    :disabled="loading || !$oc(importData).result_file_url()"
                                    @click="downloadFile($oc(importData).result_file_url())"
                                >
                                    <v-icon left>fa-fw fa-file-download</v-icon>
                                    {{ $t('component.import.button.download_result_file') }}
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>

                <v-card-text
                    v-else-if="step === 'progress'"
                    key="progress"
                    class="py-15"
                >
                    <v-progress-linear
                        height="8"
                        color="accent"
                        indeterminate
                    />

                    <div class="caption text-align-center mt-2">
                        {{ $t('import.in-progress') }}
                    </div>
                </v-card-text>

                <v-card-text
                    v-else
                    key="import"
                >
                    <k-upload
                        height="100%"
                        inline
                        :endpoint="uploadImportEndpoint"
                        :allowed-file-types="allowedFileTypes"
                        :max-file-size="maxFileSize"
                        @upload="onUpload"
                        @complete="onUploadCompleted"
                        @cancel-all="onUploadCancel"
                    />
                </v-card-text>
            </v-slide-x-transition>

            <v-card-actions>
                <v-spacer />

                <v-btn
                    v-if="'import' === step"
                    text
                    ripple
                    color="primary"
                    :disabled="loading"
                    @click="open = false"
                >
                    {{ $t('cancel') }}
                </v-btn>

                <v-btn
                    v-if="'complete' === step"
                    depressed
                    ripple
                    color="primary"
                    :disabled="loading"
                    @click="open = false; reset();"
                >
                    {{ $t('close') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {ObjectMetadata} from '@klipper/bow/metadata/ObjectMetadata';
import {AjaxContent} from '@klipper/bow/mixins/http/AjaxContent';
import {mixins} from 'vue-class-component';
import {Component, Prop, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KImportWizard extends mixins(
    AjaxContent,
) {
    @Prop({type: String})
    public metadata!: string;

    @Prop({type: String})
    public uploadEndpoint!: string;

    @Prop({type: Array, default() {
        return this.$klipper.defaultImportFormats;
    }})
    public formats!: string;

    @Prop({type: Number, default: 10737418240})
    public maxFileSize: number;

    private open: boolean = false;

    private importData: Dictionary<any>|null = null;

    private get step(): string {
        if (!!this.importData) {
            if (['success', 'error'].includes(this.importStatus)) {
                return 'complete';
            }

            return 'progress';
        }

        return 'import';
    }

    private get importStatus(): string {
        return this.importData?.status || 'waiting';
    }

    private get completeAlertType(): string {
        if ('error' === this.importStatus) {
            return 'error';
        }

        return 'success' === this.importStatus ? 'success' : 'info';
    }

    private get completeAlertErrorMessage(): string|undefined {
        const statusCode = this.importData?.status_code || null;

        if (!!statusCode) {
            const statusCodeSplit = statusCode.split(': ');
            const errorCode = statusCodeSplit[0];
            let message = this.$t('component.import.status_code.' + errorCode) as string;
            delete statusCodeSplit[0];

            if (statusCodeSplit.length > 0) {
                message += ': ' + statusCodeSplit.concat(': ');
            }

            return message;
        }

        return undefined;
    }

    private get genDialogProps(): Dictionary<any> {
        return Object.assign({}, this.$attrs);
    }

    private get allowedFileTypes(): string[] {
        const types = [];

        for (const format of this.formats) {
            types.push('.' + format);
        }

        return types;
    }

    private get uploadImportEndpoint(): string {
        if (this.uploadEndpoint) {
            return this.uploadEndpoint;
        }

        if (!this.metadata) {
            throw new Error('The metadata prop or upload-endpoint prop is required for the import wizard');
        }

        const metadatas = this.$store.state.metadata.metadatas as Dictionary<ObjectMetadata>;

        return !!metadatas[this.metadata]
            ? this.$api.getBaseUrl() + '/' + this.$org + '/import/' + metadatas[this.metadata].pluralName
            : '';
    }

    public openWizard(): void {
        this.open = true;
    }

    public closeWizard(): void {
        this.open = false;
    }

    public reset(): void {
        this.previousRequests.cancelAll();
        this.resetPreviousError();
        this.finishLoading();
        this.importData = null;
    }

    private onUploadCancel(): void {
        this.loading = false;
    }

    private onUpload(): void {
        this.loading = true;
    }

    private async onUploadCompleted(data: any): Promise<void> {
        this.loading = false;
        const failed = data?.failed || [];
        const successful = data?.successful || [];

        if (0 === failed.length && successful.length > 0) {
            this.importData = successful[0].response.body as Dictionary<any>;
        }
    }

    private async downloadFile(fileUrl: string): Promise<void> {
        const res = await this.fetchData(async (canceler) => {
            return await this.$api.requestRaw<string>({
                url: fileUrl,
                method: 'GET',
                responseType: 'blob',
            }, canceler);
        });

        if (null !== res) {
            let filename = 'export.csv';
            const disposition = res.request.getResponseHeader('Content-Disposition');

            if (disposition && disposition.indexOf('attachment') !== -1) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(disposition);

                if (matches != null && matches[1]) {
                    filename = matches[1].replace(/['"]/g, '');
                }
            }


            const fileURL = window.URL.createObjectURL(new Blob([res.data]));
            const fileLink = document.createElement('a');

            fileLink.href = fileURL;
            fileLink.setAttribute('download', filename);
            document.body.appendChild(fileLink);

            fileLink.click();
        }
    }

    @Watch('loading')
    private watchLoading(loading: boolean): void {
        this.$emit('loading', loading);
    }

    @Watch('open')
    private watchOpen(open: boolean): void {
        if (open) {
            this.$emit('open', open);
        } else {
            this.$emit('close', open);
        }
    }
}
</script>
