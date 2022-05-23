/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {StandardViewFieldable} from '@klipper/bow/composables/mixins/standardViewFieldable';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import Vue from 'vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
interface Computed {
    get genAssociationEditProps(): Dictionary<any>;
    get isRequired(): boolean;
    get isReadonly(): boolean;
    get isMultiple(): boolean;
    get targetMetadata(): string;
    get itemText(): string;
    get itemValue(): string;
    get fieldMetadataChoiceInputConfig(): Dictionary<any>|undefined;
    get fieldMetadataChoiceTargetMetadata(): string|undefined;
}

export const StandardViewAssociationable = Vue.extend<{}, {}, Computed>({
    name: 'standardViewAssociationable',

    mixins: [
        StandardViewFieldable,
    ],

    computed: {
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

        isRequired(): boolean {
            if (undefined !== this.required) {
                return this.required;
            }

            return !!this.associationMetadata && this.associationMetadata.required;
        },

        isReadonly(): boolean {
            if (undefined !== this.readonly) {
                return this.readonly;
            }

            return !!this.associationMetadata && this.associationMetadata.readOnly;
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
    },
});
