<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-component-import-action
        :metadata="metadata"
        :endpoint="uploadEndpoint"
        :formats="formats"
        :wizard-props="wizardProps"
        v-slot="{loading, openWizard}"
        @open="$emit('open', false)"
        @close="$emit('close', false)"
    >
        <v-btn
            v-bind="$attrs"
            v-on="$listeners"
            :icon="btnIcon"
            :loading="loading"
            @click="openWizard"
        >
            <slot name="icon">
                <v-icon v-bind="genIconProps">{{ icon }}</v-icon>
            </slot>
        </v-btn>
    </k-component-import-action>
</template>

<script lang="ts">
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {defineComponent, PropType} from '@vue/composition-api';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default defineComponent({
    name: 'KImportAction',

    props: {
        metadata: {
            type: String,
            default: undefined,
        },

        uploadEndpoint: {
            type: String,
            default: undefined,
        },

        icon: {
            type: String,
            default: 'fa-fw fa-file-upload',
        },

        btnIcon: {
            type: Boolean,
            default: false,
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

    computed: {
        genIconProps(): Dictionary<any> {
            return {
                small: !!this.$attrs.small || '' === this.$attrs.small,
            };
        },
    },
});
</script>
