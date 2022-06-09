<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-import-wizard
        ref="wizard"
        v-bind="wizardProps"
        :metadata="metadata"
        :upload-endpoint="endpoint"
        :formats="formats"
        @loading="loading = $event"
        @open="open = true"
        @close="open = false"
    >
        <template v-slot:dialog-activator="{attrs, on}">
            <slot
                name="default"
                v-bind="genSlotProps"
                :attrs="attrs"
                :on="on"
            />
        </template>
    </k-import-wizard>
</template>

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
    name: 'KComponentImportAction',

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
                return this.$klipper.defaultImportFormats;
            },
        },

        wizardProps: {
            type: Object as PropType<Dictionary<any>>,
            default: () => ({}),
        },
    },

    data() {
        return {
            open: false as boolean,
        };
    },

    computed: {
        genSlotProps(): Dictionary<any> {
            return {
                metadata: this.metadata,
                formats: this.formats,
                getLabel: this.getLabel,
                getFormatIcon: this.getFormatIcon,
                openWizard: this.openWizard,
                closeWizard: this.closeWizard,
                open: this.open,
                loading: this.loading,
                previousError: this.previousError,
            };
        },
    },

    methods: {
        getLabel(): string {
            return this.$t('import.file');
        },

        getFormatIcon(): string {
            return 'fa-fw fa-file-upload';
        },

        openWizard(): void {
            this.open = true;
        },

        closeWizard(): void {
            this.open = false;
        },
    },

    watch: {
        open: {
            handler(open: boolean): void {
                const $wizard = this.$refs.wizard as any;

                if ($wizard) {
                    if (open) {
                        $wizard.openWizard();
                        this.$emit('open', true);
                    } else {
                        $wizard.closeWizard();
                        this.$emit('close', false);
                    }
                }
            },
        },
    },
});
</script>
