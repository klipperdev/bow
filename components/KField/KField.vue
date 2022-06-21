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
import {ajaxSelectFormable} from '@klipper/bow/composables/mixins/formable';
import {SkeletonLoaderable} from '@klipper/bow/composables/mixins/skeletonLoaderable';
import {StandardViewBaseField} from '@klipper/bow/composables/mixins/standardViewBaseField';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {defineComponent} from '@vue/composition-api';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default defineComponent({
    name: 'KField',

    mixins: [
        StandardViewBaseField,
        SkeletonLoaderable,
        ajaxSelectFormable('edit'), // Allow to call all available methods for fields and associations
    ],

    props: {
        editMode: {
            type: Boolean,
            default: undefined,
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

        isMultiple(): boolean {
            if (!this.objectMetadata) {
                return false;
            }

            if (!!this.associationMetadata && ['one-to-many', 'many-to-many'].includes(this.associationMetadata.type)) {
                return true;
            }

            return !!this.fieldMetadataChoiceInputConfig && !!this.fieldMetadataChoiceInputConfig.multiple;
        },

        targetMetadata(): string {
            if (!!this.associationMetadata) {
                return this.associationMetadata.target;
            }

            return this.fieldMetadataChoiceTargetMetadata || this.name;
        },

        itemText(): string {
            if (!!this.$attrs['item-text']) {
                return this.$attrs['item-text'];
            }

            if (!!this.targetMetadata) {
                const targetObjectMetadata = this.getObjectMetadata(this.targetMetadata);

                if (!!targetObjectMetadata && !!targetObjectMetadata.fieldLabel) {
                    return targetObjectMetadata.fieldLabel;
                }
            }

            return this.itemValue;
        },

        itemValue(): string {
            if (!!this.targetMetadata) {
                const targetObjectMetadata = this.getObjectMetadata(this.targetMetadata);

                if (!!targetObjectMetadata) {
                    if (!!this.fieldMetadataChoiceInputConfig && this.fieldMetadataChoiceInputConfig.name_path) {
                        return this.fieldMetadataChoiceInputConfig.name_path;
                    }

                    if (!!targetObjectMetadata.fieldIdentifier) {
                        return targetObjectMetadata.fieldIdentifier;
                    }
                }
            }

            return 'id';
        },

        fieldMetadataChoiceInputConfig(): Dictionary<any>|undefined {
            if (!!this.fieldMetadata
                && 'choice' === this.fieldMetadata.input
                && typeof this.fieldMetadata.inputConfig.choices === 'string'
                && this.fieldMetadata.inputConfig.choices.startsWith('#/metadatas/')) {
                return this.fieldMetadata.inputConfig;
            }

            return undefined;
        },

        fieldMetadataChoiceTargetMetadata(): string|undefined {
            return !!this.fieldMetadataChoiceInputConfig
            && typeof this.fieldMetadataChoiceInputConfig.choices === 'string'
                ? this.fieldMetadataChoiceInputConfig.choices.substr(12)
                : undefined;
        },

        genEditProps(): Dictionary<any> {
            let props = this._genEditProps;

            if (!this.isField) {
                props = Object.assign(props, {
                    'multiple': this.isMultiple,
                    'target-metadata': this.targetMetadata,
                    'return-object': !this.fieldMetadataChoiceInputConfig,
                    'item-text': this.itemText,
                });

                if (!!this.fieldMetadataChoiceInputConfig) {
                    props['item-value'] = this.itemValue;
                }
            }

            return props;
        },

        genAssociationEditProps(): Dictionary<any> {
            const props = Object.assign({
                'multiple': this.isMultiple,
                'target-metadata': this.targetMetadata,
                'return-object': !this.fieldMetadataChoiceInputConfig,
                'item-text': this.itemText,
            }, this.genEditProps);

            if (!!this.fieldMetadataChoiceInputConfig) {
                props['item-value'] = this.itemValue;
            }

            return props;
        },

        genEditMode(): boolean {
            return (undefined === this.editMode && this.standardData.editMode) || true === this.editMode;
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
