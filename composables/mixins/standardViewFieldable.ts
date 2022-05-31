/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {StandardViewItem} from '@klipper/bow/composables/mixins/standardViewItem';
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
    name: string;
    propertyPath?: string;
    label?: string;
    defaultValue: string;
    required?: boolean;
    translatable?: boolean;
    readonly?: boolean;
    disabled: boolean;
    autofocus: boolean;
    vertical: boolean;
    dense: boolean;
    disableKeyPush: boolean;
    colLabelProps?: Dictionary<any>;
    colLabelOn?: Dictionary<any>;
    viewProps?: Dictionary<any>;
    viewOn?: Dictionary<any>;
    editProps?: Dictionary<any>;
    editOn?: Dictionary<any>;
    rules: RuleValidate[];
}

interface Computed {
    get fieldValue(): any;
    set fieldValue(value: any);
    get isEmpty(): boolean;
    get isRequired(): boolean;
    get isTranslatable(): boolean;
    get isReadonly(): boolean;
    get fieldMetadata(): FieldMetadata|null;
    get associationMetadata(): AssociationMetadata|null;
    get genPropertyPath(): string;
    get genLabel(): string|undefined;
    get genRules(): RuleValidate[];
    get genColLabelProps(): Dictionary<any>;
    get genColLabelListeners(): Dictionary<any>;
    get genViewProps(): Dictionary<any>;
    get genViewListeners(): Dictionary<any>;
    get genEditProps(): Dictionary<any>;
    get genEditListeners(): Dictionary<any>;
}

interface Methods {
    getObjectMetadata(name: string): ObjectMetadata|null,
    getDefaultRules(): RuleValidate[],
}

export const StandardViewFieldable = Vue.extend<{}, Methods, Computed, Props>({
    name: 'standardViewFieldable',

    mixins: [
        StandardViewItem,
    ],

    props: {
        name: {
            type: String,
            required: true,
        },

        propertyPath: {
            type: String,
            default: undefined,
        },

        label: {
            type: String,
            default: undefined,
        },

        defaultValue: {
            type: String,
            default: '~',
        },

        required: {
            type: Boolean,
            default: undefined,
        },

        translatable: {
            type: Boolean,
            default: undefined,
        },

        readonly: {
            type: Boolean,
            default: undefined,
        },

        disabled: {
            type: Boolean,
            default: false,
        },

        autofocus: {
            type: Boolean,
            default: false,
        },

        vertical: {
            type: Boolean,
            default: false,
        },

        dense: {
            type: Boolean,
            default: false,
        },

        disableKeyPush: {
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

        viewProps: {
            type: Object as PropType<Dictionary<any>|undefined>,
            default: undefined,
        },

        viewOn: {
            type: Object as PropType<Dictionary<any>|undefined>,
            default: undefined,
        },

        editProps: {
            type: Object as PropType<Dictionary<any>|undefined>,
            default: undefined,
        },

        editOn: {
            type: Object as PropType<Dictionary<any>|undefined>,
            default: undefined,
        },

        rules: {
            type: Array as PropType<RuleValidate[]>,
            default: () => [],
        },
    },

    computed: {
        fieldValue: {
            get(): any {
                return this.standardData.data ? getPropertyFromItem(this.standardData.data, this.genPropertyPath) : undefined;
            },

            set(value: any) {
                if (typeof this.standardData.data === 'object') {
                    setReactiveDeepValue(this.standardData.data, this.genPropertyPath, value);
                }
            },
        },

        isEmpty(): boolean {
            return !this.standardData.data
                || undefined === this.fieldValue
                || '' === this.fieldValue
                || (Array.isArray(this.fieldValue) && 0 === this.fieldValue.length);
        },

        isRequired(): boolean {
            if (undefined !== this.required) {
                return this.required;
            }

            return !!this.fieldMetadata && this.fieldMetadata.required;
        },

        isTranslatable(): boolean {
            if (undefined !== this.translatable) {
                return this.translatable;
            }

            return !!this.objectMetadata
                && this.objectMetadata.translatable
                && !!this.fieldMetadata
                && this.fieldMetadata.translatable;
        },

        isReadonly(): boolean {
            if (undefined !== this.readonly) {
                return this.readonly;
            }

            return !!this.fieldMetadata && this.fieldMetadata.readOnly;
        },

        fieldMetadata(): FieldMetadata|null {
            return !!this.objectMetadata && this.objectMetadata.fields[this.name]
                ? this.objectMetadata.fields[this.name]
                : null;
        },

        associationMetadata(): AssociationMetadata|null {
            return !!this.objectMetadata && this.objectMetadata.associations[this.name]
                ? this.objectMetadata.associations[this.name]
                : null;
        },

        genPropertyPath(): string {
            return this.propertyPath || this.name;
        },

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

        genRules(): RuleValidate[] {
            const rules = [] as RuleValidate[];

            if (this.isRequired) {
                rules.push(this.$r('required'));
            }

            for (const defaultRule of this.getDefaultRules()) {
                rules.push(defaultRule);
            }

            for (const rule of this.rules) {
                rules.push(rule);
            }

            return rules;
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

        genViewProps(): Dictionary<any> {
            return this.viewProps || {};
        },

        genViewListeners(): Dictionary<any> {
            return this.viewOn || {};
        },

        genEditProps(): Dictionary<any> {
            const placeholder = undefined === this.$attrs.placeholder
            && (undefined !== this.$attrs['hide-label'] || undefined !== this.$attrs.unwrap)
                ? this.genLabel
                : undefined;
            const objPlaceholder = undefined !== placeholder ? {placeholder} : {};

            return Object.assign({
                'name': this.name,
                'disabled': this.disabled || this.standardData.loading,
                'error-messages': getFieldErrors(this.name, this.standardData.error),
                'rules': this.genRules,
                'autofocus': this.autofocus,
                'dense': this.dense || this.standardData.dense,
            }, objPlaceholder, this.editProps || {});
        },

        genEditListeners(): Dictionary<any> {
            if (this.disableKeyPush) {
                return Object.assign({}, this.$listeners || {}, this.editOn || {});
            }

            return Object.assign({
                keydown: async (e: KeyboardEvent) => {
                    if ('Enter' === e.key) {
                        await this.standardData.pushAction();
                    }
                },
            }, this.$listeners || {}, this.editOn || {});
        },
    },

    methods: {
        getObjectMetadata(name: string): ObjectMetadata|null {
            if (!this.isMetadataInitialized || !this.$store.state.metadata.metadatas[name]) {
                return null;
            }

            return this.$store.state.metadata.metadatas[name];
        },

        getDefaultRules(): RuleValidate[] {
            return [];
        },
    },
});