<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts">
import {AjaxContent} from '@klipper/bow/composables/mixins/http/ajaxContent';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {consoleWarn} from '@klipper/bow/utils/console';
import {Filter} from '@klipper/sdk/models/filters/Filter';
import {Sort} from '@klipper/sdk/requests/Sort';
import {defineComponent} from '@vue/composition-api';
import {CreateElement, Props, PropType, RenderContext, VNode} from 'vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default defineComponent({
    name: 'KComponentExportAction',

    mixins: [
        AjaxContent,
    ],

    props: {
        metadata: {
            type: String,
        },

        endpoint: {
            type: String,
        },

        formats: {
            type: Array as PropType<string[]>,
            default() {
                return this.$klipper.defaultExportFormats;
            },
        },

        sort: {
            type: [String, Array] as PropType<string|string[]|Sort|Sort[]|undefined>,
            default: undefined,
        },

        filter: {
            type: Object as PropType<Filter|undefined>,
            default: undefined,
        },

        search: {
            type: String,
            default: undefined,
        },

        fields: {
            type: Array as PropType<string[]|undefined>,
            default: undefined,
        },
    },

    data() {
        return {
            exportingFormat: null as string|null,
        };
    },

    computed: {
        isSingle(): boolean {
            return 1 === this.formats.length;
        },

        genSlotProps(): Dictionary<any> {
            return {
                metadata: this.metadata,
                formats: this.formats,
                isSingle: this.isSingle,
                getLabel: this.getLabel,
                getFormatLabel: this.getFormatLabel,
                getFormatIcon: this.getFormatIcon,
                exportAction: this.export,
                loading: this.loading,
                previousError: this.previousError,
                exportingFormat: this.exportingFormat,
            };
        },
    },

    methods: {
        getLabel(format: string): string {
            return this.$t('export.format', {'format': this.getFormatLabel(format)});
        },

        getFormatLabel(format: string): string {
            return format.toUpperCase();
        },

        getFormatIcon(format: string): string {
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
        },

        async export(format?: string): Promise<void> {
            const meta = await this.$metadata.get(this.metadata);

            if (!format && this.formats.length > 0) {
                format = this.formats[0];
            }

            if (0 === this.formats.length || !this.formats.includes(format) || (!meta && !this.endpoint)) {
                consoleWarn('The metadata or endpoint props must be defined to use export component');

                return;
            }

            this.exportingFormat = format;

            const exportUrl = !meta
                ? this.endpoint
                : '/{organization}/' + meta.pluralName + '.{ext}';

            const res = await this.fetchData(async (canceler) => {
                return await this.$api.requestRaw<string>({
                    url: exportUrl.replaceAll('{ext}', format),
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

            this.exportingFormat = null;
        },
    },

    watch: {
        loading: {
            handler(loading: boolean): void {
                this.$emit('loading', loading);
            },
        },
    },

    render(createElement: CreateElement, context: RenderContext<Props>): VNode | VNode[] {
        const defaultSlot = this.$scopedSlots.default ? this.$scopedSlots.default(this.genSlotProps) : undefined;

        if (0 === defaultSlot.length) {
            return defaultSlot;
        }

        return createElement('div', {
            class: 'k-component-export-action',

            props: this.$attrs,

            on: this.$listeners,
        }, defaultSlot);
    },
});
</script>
