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
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KImportAction extends Vue {
    @Prop({type: String})
    public metadata!: string;

    @Prop({type: String})
    public uploadEndpoint!: string;

    @Prop({type: String, default: 'fa-fw fa-file-upload'})
    public icon!: string;

    @Prop({type: Boolean, default: false})
    public btnIcon!: boolean;

    @Prop({type: Array, default() {
        return this.$klipper.defaultImportFormats;
    }})
    public formats!: string;

    @Prop({type: Object, default: () => {}})
    public wizardProps!: Dictionary<any>;

    private get genIconProps(): Dictionary<any> {
        return {
            small: !!this.$attrs.small || '' === this.$attrs.small,
        };
    }
}
</script>
