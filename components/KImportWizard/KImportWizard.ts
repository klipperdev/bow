/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

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
    @Prop({type: String, required: true})
    public metadata!: string;

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
        return this.$oc<any>(this.importData).status('waiting');
    }

    private get completeAlertType(): string {
        if ('error' === this.importStatus) {
            return 'error';
        }

        return 'success' === this.importStatus ? 'success' : 'info';
    }

    private get completeAlertErrorMessage(): string|undefined {
        const statusCode = this.$oc<any>(this.importData).status_code(null);

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
        const metadatas = this.$store.state.metadata.metadatas as Dictionary<ObjectMetadata>;

        return !!metadatas[this.metadata]
            ? this.$api.getBaseUrl() + '/' + this.$org + '/import/' + metadatas[this.metadata].pluralName
            : '';
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
        const $data = this.$oc<any>(data);
        const failed = $data.failed([]);
        const successful = $data.successful([]);

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
}
