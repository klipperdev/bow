/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {StandardViewBaseField} from '@klipper/bow/composables/mixins/standardViewBaseField';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {AssociationMetadata} from '@klipper/bow/metadata/AssociationMetadata';
import {FieldMetadata} from '@klipper/bow/metadata/FieldMetadata';
import {ObjectMetadata} from '@klipper/bow/metadata/ObjectMetadata';
import {getFieldErrors} from '@klipper/bow/utils/error';
import {getPropertyFromItem, setReactiveDeepValue} from '@klipper/bow/utils/object';
import {RuleValidate} from '@klipper/bow/validator/Rule';
import Vue, {PropType} from 'vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
interface Props {
    label?: string;
    vertical: boolean;
    colLabelProps?: Dictionary<any>;
    colLabelOn?: Dictionary<any>;
}

interface Computed {
    get genLabel(): string|undefined;
    get genColLabelProps(): Dictionary<any>;
    get genColLabelListeners(): Dictionary<any>;
}

interface Methods {
    getObjectMetadata(name: string): ObjectMetadata|null,
    getDefaultRules(): RuleValidate[],
}

export const StandardViewFieldable = Vue.extend<{}, Methods, Computed, Props>({
    name: 'standardViewFieldable',

    mixins: [
        StandardViewBaseField,
    ],

    props: {
        label: {
            type: String,
            default: undefined,
        },

        vertical: {
            type: Boolean,
            default: false,
        },

        colLabelProps: {
            type: Object as PropType<Dictionary<any>|undefined>,
            default: undefined,
        },

        colLabelOn: {
            type: Object as PropType<Dictionary<any>|undefined>,
            default: undefined,
        },
    },

    computed: {
        genLabel(): string|undefined {
            if (this.label) {
                return this.label;
            }

            if (this.colLabelProps && this.colLabelProps.label) {
                return this.colLabelProps.label;
            }

            return this.isMetadataInitialized && this.metadataName
                ? this.$metadata.getFieldOrAssociationLabel(this.metadataName, this.name)
                : undefined;
        },

        genColLabelProps(): Dictionary<any> {
            return Object.assign({
                'label': this.genLabel,
                'empty': !this.standardData.loading && this.isEmpty,
                'edit-mode': !this.isReadonly && this.standardData.editMode,
                'edit-label-required': this.isRequired,
                'edit-translate': this.isTranslatable && this.standardData.currentLocale ? this.standardData.currentLocale : undefined,
                'vertical': this.vertical || this.standardData.vertical,
                'disable-loading': this.standardData.editMode,
                ...this.colLabelProps,
            }, this.$attrs);
        },

        genColLabelListeners(): Dictionary<any> {
            return Object.assign({}, this.colLabelOn || {}, this.$listeners);
        },
    },
});
