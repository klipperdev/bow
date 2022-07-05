<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-component-export-action
        ref="export"
        :metadata="metadata"
        :formats="formats"
        :sort="sort"
        :filter="filter"
        :search="search"
        :fields="fields"
        class="v-btn"
        v-slot="exportProps"
    >
        <v-btn
            v-bind="$attrs"
            v-on="$listeners"
            :id="'exportAction_' + _uid"
            :loading="exportProps.loading"
            :icon="btnIcon"
            @click="onClickButton"
        >
            <slot name="icon">
                <v-icon v-bind="genIconProps">{{ icon }}</v-icon>
            </slot>

            <v-icon
                v-if="!exportProps.isSingle"
                v-bind="genIconProps"
            >
                arrow_drop_down
            </v-icon>

            <v-menu
                v-if="!exportProps.isSingle"
                v-bind="genMenuProps"
                v-model="open"
                :activator="'#exportAction_' + _uid"
            >
                <v-list dense>
                    <v-list-item
                        v-for="format in exportProps.formats"
                        :key="format"
                        @click="exportProps.exportAction(format)"
                    >
                        <v-list-item-title>
                            <v-icon small left>{{ exportProps.getFormatIcon(format) }}</v-icon>
                            {{ exportProps.getLabel(format) }}
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-btn>
    </k-component-export-action>
</template>

<script lang="ts">
import {AjaxContent} from '@klipper/bow/composables/mixins/http/ajaxContent';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {Sort} from '@klipper/sdk/requests/Sort';
import {defineComponent, PropType} from '@vue/composition-api';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default defineComponent({
    name: 'KExportAction',

    mixins: [
        AjaxContent,
    ],

    props: {
        metadata: {
            type: String,
            default: undefined,
        },

        exportEndpoint: {
            type: String,
            default: undefined,
        },

        icon: {
            type: String,
            default: 'fa-fw fa-file-download',
        },

        btnIcon: {
            type: Boolean,
            default: false,
        },

        formats: {
            type: Array as PropType<string[]>,
            default() {
                return this.$klipper.defaultExportFormats;
            },
        },

        menuProps: {
            type: Object as PropType<Dictionary<any>>,
            default: () => ({}),
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

    data(): Dictionary<any> {
        return {
            open: false as boolean,
        };
    },

    computed: {
        genIconProps(): Dictionary<any> {
            return {
                small: !!this.$attrs.small || '' === this.$attrs.small,
            };
        },

        genMenuProps(): Dictionary<any> {
            return Object.assign({
                'open-on-click': false,
                'transition': 'slide-y-transition',
                'max-height': '90vh',
                'offset-y': true,
                'bottom': true,
                'left': true,
            }, this.menuProps);
        },
    },

    methods: {
        async export(): Promise<void> {
            await this.$refs.export.export();
        },

        async onClickButton(): Promise<void> {
            if (this.$refs.export.isSingle) {
                await this.$refs.export.export(this.$refs.export.formats[0]);
            } else {
                this.open = true;
            }
        },
    },
});
</script>
