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
import {genSubRefName} from '@klipper/bow/utils/vnode';
import {RuleValidate} from '@klipper/bow/validator/Rule';
import Vue, {PropType} from 'vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
interface Props {
    name: string;
    propertyPath?: string;
    defaultValue: string;
    empty?: boolean;
    required?: boolean;
    translatable?: boolean;
    readonly?: boolean;
    disabled: boolean;
    autofocus: boolean;
    dense: boolean;
    disableKeyPush: boolean;
    viewProps?: Dictionary<any>;
    viewOn?: Dictionary<any>;
    editProps?: Dictionary<any>;
    editOn?: Dictionary<any>;
    rules: RuleValidate[];
    fieldValueSetTransformer?: Function;
    fieldValueGetTransformer?: Function;
}

interface Computed {
    get isField(): boolean;
    get isAssociation(): boolean;
    get fieldValue(): any;
    set fieldValue(value: any);
    get isEmpty(): boolean;
    get isRequired(): boolean;
    get isTranslatable(): boolean;
    get isReadonly(): boolean;
    get fieldMetadata(): FieldMetadata|null;
    get associationMetadata(): AssociationMetadata|null;
    get genPropertyPath(): string;
    get genRules(): RuleValidate[];
    get genViewProps(): Dictionary<any>;
    get _genViewProps(): Dictionary<any>;
    get genViewListeners(): Dictionary<any>;
    get genEditProps(): Dictionary<any>;
    get _genEditProps(): Dictionary<any>;
    get genEditListeners(): Dictionary<any>;
}

interface Methods {
    getObjectMetadata(name: string): ObjectMetadata|null,
    getDefaultRules(): RuleValidate[],
}

export const StandardViewBaseField = Vue.extend<{}, Methods, Computed, Props>({
    name: 'standardViewBaseField',

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

        defaultValue: {
            type: String,
            default: '~',
        },

        empty: {
            type: Boolean,
            default: undefined,
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

        dense: {
            type: Boolean,
            default: false,
        },

        disableKeyPush: {
            type: Boolean,
            default: false,
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

        fieldValueSetTransformer: {
            type: Function,
            default: (value?: any) => (value),
        },

        fieldValueGetTransformer: {
            type: Function,
            default: (value?: any) => (value),
        },
    },

    computed: {
        isField(): boolean {
            return !!this.fieldMetadata;
        },

        isAssociation(): boolean {
            return !!this.associationMetadata;
        },

        fieldValue: {
            get(): any {
                return this.fieldValueGetTransformer(this.standardData.data ? getPropertyFromItem(this.standardData.data, this.genPropertyPath) : undefined);
            },

            set(value: any): void {
                if (typeof this.standardData.data === 'object') {
                    setReactiveDeepValue(this.standardData.data, this.genPropertyPath, this.fieldValueSetTransformer(value));
                }
            },
        },

        isEmpty(): boolean {
            if (undefined !== this.empty) {
                return this.empty;
            }

            return !this.standardData.data
                || undefined === this.fieldValue
                || '' === this.fieldValue
                || (Array.isArray(this.fieldValue) && 0 === this.fieldValue.length);
        },

        isRequired(): boolean {
            if (undefined !== this.required) {
                return this.required;
            }

            return (!!this.fieldMetadata && this.fieldMetadata.required) || (!!this.associationMetadata && this.associationMetadata.required);
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

            return (!!this.fieldMetadata && this.fieldMetadata.readOnly) || (!!this.associationMetadata && this.associationMetadata.readOnly);
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
            return this.propertyPath ?? this.name;
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

        genViewProps(): Dictionary<any> {
            return this._genViewProps;
        },

        _genViewProps(): Dictionary<any> {
            return Object.assign({
                'ref': genSubRefName(this, 'read'),
            }, this.viewProps ?? {});
        },

        genViewListeners(): Dictionary<any> {
            return this.viewOn ?? {};
        },

        genEditProps(): Dictionary<any> {
            return this._genEditProps;
        },

        _genEditProps(): Dictionary<any> {
            const placeholder = undefined === this.$attrs.placeholder
            && (undefined !== this.$attrs['hide-label'] || undefined !== this.$attrs.unwrap)
                ? this.genLabel
                : undefined;
            const objPlaceholder = undefined !== placeholder ? {placeholder} : {};
            const valueProps = {} as Dictionary<any>;

            if ('boolean' === this.fieldMetadata?.type) {
                valueProps.checked = this.fieldValue;
                valueProps['input-value'] = this.fieldValue;
            } else {
                valueProps.value = this.fieldValue;
            }

            return Object.assign({
                'ref': genSubRefName(this, 'edit'),
                'name': this.name,
                'disabled': this.disabled || this.standardData.loading,
                'error-messages': getFieldErrors(this.name, this.standardData.error),
                'rules': this.genRules,
                'autofocus': this.autofocus,
                'dense': this.dense || this.standardData.dense,
            }, objPlaceholder, valueProps, this.editProps ?? {});
        },

        genEditListeners(): Dictionary<any> {
            const listeners: Dictionary<any> = {};
            const editOnListeners = this.editOn ?? {};
            const bindEvent = this.isAssociation || 'boolean' === this.fieldMetadata?.type ? 'change' : 'input';

            listeners[bindEvent] = (value: any) => {
                this.fieldValue = value;
            };

            if (!this.disableKeyPush) {
                listeners.keydown = async (e: KeyboardEvent) => {
                    if ('Enter' === e.key) {
                        await this.standardData.pushAction();
                    }
                };
            }

            for (const onEventName in editOnListeners) {
                const stdListener = listeners[onEventName];
                const onListener = editOnListeners[onEventName];

                if (!!stdListener) {
                    listeners[onEventName] = (value: any) => {
                        stdListener(value);
                        onListener(value);
                    };
                } else {
                    listeners[onEventName] = onListener;
                }
            }

            return listeners;
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
