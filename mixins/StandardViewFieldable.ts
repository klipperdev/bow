/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {AssociationMetadata} from '@klipper/bow/metadata/AssociationMetadata';
import {FieldMetadata} from '@klipper/bow/metadata/FieldMetadata';
import {ObjectMetadata} from '@klipper/bow/metadata/ObjectMetadata';
import {StandardViewItem} from '@klipper/bow/mixins/StandardViewItem';
import {getFieldErrors} from '@klipper/bow/utils/error';
import {getPropertyFromItem, setReactiveDeepValue} from '@klipper/bow/utils/object';
import {RuleValidate} from '@klipper/bow/validator/Rule';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class StandardViewFieldable<V = any> extends mixins(
    StandardViewItem,
) {
    @Prop({type: String, required: true})
    public name!: string;

    @Prop({type: String})
    public propertyPath!: string;

    @Prop({type: String})
    public label!: string;

    @Prop({type: String, default: '~'})
    public defaultValue!: string;

    @Prop({type: Boolean, default: undefined})
    public required!: boolean|undefined;

    @Prop({type: Boolean, default: undefined})
    public translatable!: boolean|undefined;

    @Prop({type: Boolean, default: undefined})
    public readonly!: boolean|undefined;

    @Prop({type: Boolean, default: false})
    public disabled!: boolean;

    @Prop({type: Boolean, default: false})
    public autofocus!: boolean;

    @Prop({type: Object})
    public colLabelProps!: Dictionary<any>|undefined;

    @Prop({type: Object})
    public colLabelOn!: Dictionary<any>|undefined;

    @Prop({type: Object})
    public viewProps!: Dictionary<any>|undefined;

    @Prop({type: Object})
    public viewOn!: Dictionary<any>|undefined;

    @Prop({type: Object})
    public editProps!: Dictionary<any>|undefined;

    @Prop({type: Object})
    public editOn!: Dictionary<any>|undefined;

    @Prop({type: Array, default: () => []})
    public rules!: RuleValidate[];

    protected get fieldValue(): any {
        return this.standardData.data ? getPropertyFromItem(this.standardData.data, this.genPropertyPath) : undefined;
    }

    protected set fieldValue(value: any) {
        if (typeof this.standardData.data === 'object') {
            setReactiveDeepValue(this.standardData.data, this.genPropertyPath, value);
        }
    }

    protected get isEmpty(): boolean {
        return !this.standardData.data
            || !this.fieldValue
            || (Array.isArray(this.fieldValue) && 0 === this.fieldValue.length);
    }

    protected get isRequired(): boolean {
        if (undefined !== this.required) {
            return this.required;
        }

        return !!this.fieldMetadata && this.fieldMetadata.required;
    }

    protected get isTranslatable(): boolean {
        if (undefined !== this.translatable) {
            return this.translatable;
        }

        return !!this.objectMetadata
            && this.objectMetadata.translatable
            && !!this.fieldMetadata
            && this.fieldMetadata.translatable;
    }

    protected get isReadonly(): boolean {
        if (undefined !== this.readonly) {
            return this.readonly;
        }

        return !!this.fieldMetadata && this.fieldMetadata.readOnly;
    }

    protected get fieldMetadata(): FieldMetadata|null {
        return !!this.objectMetadata && this.objectMetadata.fields[this.name]
            ? this.objectMetadata.fields[this.name]
            : null;
    }

    protected get associationMetadata(): AssociationMetadata|null {
        return !!this.objectMetadata && this.objectMetadata.associations[this.name]
            ? this.objectMetadata.associations[this.name]
            : null;
    }

    protected get genPropertyPath(): string {
        return this.propertyPath || this.name;
    }

    protected get genLabel(): string|undefined {
        if (this.label) {
            return this.label;
        }

        if (this.colLabelProps && this.colLabelProps.label) {
            return this.colLabelProps.label;
        }

        return this.isMetadataInitialized && this.standardData.metadata
            ? this.$metadata.getFieldOrAssociationLabel(this.standardData.metadata, this.name)
            : undefined;
    }

    protected get genRules(): RuleValidate[] {
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
    }

    protected get genColLabelProps(): Dictionary<any> {
        return Object.assign({
            'label': this.genLabel,
            'empty': !this.standardData.loading && this.isEmpty,
            'edit-mode': !this.isReadonly && this.standardData.editMode,
            'edit-label-required': this.isRequired,
            'edit-translate': this.isTranslatable && this.standardData.currentLocale ? this.standardData.currentLocale : undefined,
            ...this.colLabelProps,
        }, this.$attrs);
    }

    protected get genColLabelListeners(): Dictionary<any> {
        return Object.assign({}, this.colLabelOn || {}, this.$listeners);
    }

    protected get genViewProps(): Dictionary<any> {
        return this.viewProps || {};
    }

    protected get genViewListeners(): Dictionary<any> {
        return this.viewOn || {};
    }

    protected get genEditProps(): Dictionary<any> {
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
        }, objPlaceholder, this.editProps || {});
    }

    protected get genEditListeners(): Dictionary<any> {
        return Object.assign({
            keydown: async (e: KeyboardEvent) => {
                if ('Enter' === e.key) {
                    await this.standardData.pushAction();
                }
            },
        }, this.editOn || {});
    }

    public created(): void {
        if ((this as any).standardView) {
            (this as any).standardView.register(this);
        }
    }

    public beforeDestroy(): void {
        if ((this as any).standardView) {
            (this as any).standardView.unregister(this);
        }
    }

    protected getObjectMetadata(name: string): ObjectMetadata|null {
        if (!this.isMetadataInitialized || !this.$store.state.metadata.metadatas[name]) {
            return null;
        }

        return this.$store.state.metadata.metadatas[name];
    }

    protected getDefaultRules(): RuleValidate[] {
        return [];
    }
}
