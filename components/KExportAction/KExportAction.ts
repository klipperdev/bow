/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {AjaxContent} from '@klipper/bow/mixins/http/AjaxContent';
import {FilterCondition} from '@klipper/sdk/models/filters/FilterCondition';
import {FilterRule} from '@klipper/sdk/models/filters/FilterRule';
import {Sort} from '@klipper/sdk/requests/Sort';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KDeleteAction extends mixins(
    AjaxContent,
) {
    @Prop({type: String, required: true})
    public metadata!: string;

    @Prop({type: String, default: 'fa-fw fa-file-download'})
    public icon!: string;

    @Prop({type: Array, default() {
        return this.$klipper.defaultExportFormats;
    }})
    public formats!: string;

    @Prop({type: Object, default: () => {}})
    public menuProps!: Dictionary<any>;

    @Prop({default: undefined})
    public sort!: string|string[]|Sort|Sort[]|undefined;

    @Prop({default: undefined})
    public filter!: FilterCondition|FilterRule|undefined;

    @Prop({type: String, default: undefined})
    public search!: string|undefined;

    @Prop({type: Array, default: undefined})
    public fields!: string[]|undefined;

    private open: boolean = false;

    private get genIconProps(): Dictionary<any> {
        return {
            small: !!this.$attrs.small,
        };
    }

    private get genMenuProps(): Dictionary<any> {
        return Object.assign({
            'open-on-click': false,
            'transition': 'slide-y-transition',
            'max-height': '90vh',
            'offset-y': true,
            'bottom': true,
            'left': true,
        }, this.menuProps);
    }

    private get isSingle(): boolean {
        return 1 === this.formats.length;
    }

    protected getFormatLabel(format: string): string {
        return format.toUpperCase();
    }

    protected getFormatIcon(format: string): string {
        switch (format) {
            case 'csv':
                return 'fa-fw fa-file-csv';
            case 'html':
                return 'fa-fw fa-html5';
            case 'pdf':
                return 'fa-fw fa-pdf';
            case 'xls':
            case 'xlsx':
                return 'fa-fw fa-file-excel';
            default:
                return 'fa-fw fa-file';
        }
    }

    private async onClickButton(): Promise<void> {
        if (this.isSingle) {
            await this.exportAction(this.formats[0]);
        } else {
            this.open = true;
        }
    }

    private async exportAction(format: string): Promise<void> {
        const meta = await this.$metadata.get(this.metadata);

        if (0 === this.formats.length || !this.formats.includes(format) || !meta) {
            return;
        }

        const res = await this.fetchData(async (canceler) => {
            return await this.$api.requestRaw<string>({
                url: '/{organization}/' + meta.pluralName + '.' + format,
                method: 'GET',
                responseType: 'blob',
                sort: this.sort || undefined,
                filter: this.filter || undefined,
                search: this.search || undefined,
                fields: this.fields || undefined,
            }, canceler);
        });

        if (null !== res) {
            let filename = 'export.' + format;
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
}
