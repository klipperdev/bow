<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div
        :class="classes"
        v-bind="$attrs"
        v-on="$listeners"
    >
        <slot
            v-if="!genEditMode && loader && isLoading"
            name="loading"
            :skeletonLoaderPropsValue="skeletonLoaderPropsValue"
        >
            <v-skeleton-loader
                v-bind="skeletonLoaderPropsValue"
            />
        </slot>

        <slot
            v-else-if="!genEditMode"
            name="read"
            v-bind="genSlotReadProps"
        >
            <slot
                name="default"
                v-bind="genSlotReadProps"
            >
                {{ $oc(fieldValue)(defaultValue) }}
            </slot>
        </slot>

        <slot
            v-else
            name="edit"
            v-bind="genSlotEditProps"
        >
            <slot
                name="read"
                v-bind="genSlotReadProps"
            >
                <slot
                    name="default"
                    v-bind="genSlotReadProps"
                >
                    {{ $oc(fieldValue)(defaultValue) }}
                </slot>
            </slot>
        </slot>
    </div>
</template>

<script lang="ts">
import {StandardViewBaseField} from '@klipper/bow/composables/mixins/standardViewBaseField';
import {defineComponent} from '@vue/composition-api';
import {SkeletonLoaderable} from '@klipper/bow/composables/mixins/skeletonLoaderable';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {randomNumberBetween} from '@klipper/bow/utils/number';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default defineComponent({
    name: 'KField',

    mixins: [
        StandardViewBaseField,
        SkeletonLoaderable,
    ],

    props: {
        editMode: {
            type: Boolean,
            default: false,
        },

        loader: {
            type: Boolean,
            default: false,
        }
    },

    computed: {
        classes(): Dictionary<any> {
            return {
                'k-field': true,
                'k-field--edit': this.genEditMode,
                'k-field--empty': this.isEmpty,
                'k-field--loading': this.isLoading,
            };
        },

        isLoading(): boolean {
            return this.standardData.loading || this.loading;
        },

        genEditMode(): boolean {
            return this.standardData.editMode || this.editMode;
        },

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
                defaultValue: this.defaultValue,
                value: this.fieldValue,
            };
        },
    },
});
</script>
