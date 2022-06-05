<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-col-label
        v-bind="genColLabelProps"
        v-on="genColLabelListeners"
        :hide-label="hideLabel"
        :unwrap="unwrap"
        :single="single"
    >
        <template v-slot:label>
            <slot
                name="label"
                v-bind="genSlotReadProps"
            />
        </template>

        <template v-slot:loading="{skeletonLoaderPropsValue}">
            <slot
                name="loading"
                v-bind="genSlotReadProps"
                :skeletonLoaderPropsValue="skeletonLoaderPropsValue"
            />
        </template>

        <template v-slot:default>
            <slot
                name="default"
                v-bind="genSlotReadProps"
            />
        </template>

        <template v-slot:read-prepend>
            <slot
                name="read-prepend"
                v-bind="genSlotReadProps"
            />
        </template>

        <template v-slot:read>
            <slot
                name="read"
                v-bind="genSlotReadProps"
            />
        </template>

        <template v-slot:read-append>
            <slot
                name="read-append"
                v-bind="genSlotReadProps"
            />
        </template>

        <template v-slot:edit-prepend>
            <slot
                name="edit-prepend"
                v-bind="genSlotEditProps"
            />
        </template>

        <template v-slot:edit>
            <slot
                name="edit"
                v-bind="genSlotEditProps"
            />
        </template>

        <template v-slot:edit-append>
            <slot
                name="edit-append"
                v-bind="genSlotEditProps"
            />
        </template>
    </k-col-label>
</template>

<script lang="ts">
import {StandardViewFieldable} from '@klipper/bow/composables/mixins/standardViewFieldable';
import {defineComponent} from '@vue/composition-api';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default defineComponent({
    name: 'KColField',

    mixins: [
        StandardViewFieldable,
    ],

    props: {
        hideLabel: {
            type: Boolean,
            default: false,
        },

        unwrap: {
            type: Boolean,
            default: false,
        },

        single: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        genSlotReadProps() {
            return {
                attrs: this.genViewProps,
                on: this.genViewListeners,
                ...this.genStdCommonProps,
            };
        },

        genSlotEditProps() {
            return Object.assign({
                attrs: this.genEditProps,
                on: this.genEditListeners,
                rules: this.genRules,
                getDefaultRules: this.getDefaultRules,
                ...this.genStdCommonProps,
            });
        },

        genStdCommonProps() {
            return {
                isMetadataInitialized: this.isMetadataInitialized,
                getObjectMetadata: this.getObjectMetadata,
                metadataName: this.metadataName,
                objectMetadata: this.objectMetadata,
                fieldMetadata: this.fieldMetadata,
                associationMetadata: this.associationMetadata,
                propertyPath: this.genPropertyPath,
                isEmpty: this.isEmpty,
                isRequired: this.isRequired,
                isTranslatable: this.isTranslatable,
                isReadonly: this.isReadonly,
                label: this.genLabel,
                defaultValue: this.defaultValue,
                value: this.fieldValue,
            };
        },
    },
});
</script>
