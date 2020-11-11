/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {ObjectMetadata} from '@klipper/bow/metadata/ObjectMetadata';
import {inject as RegistrableInject} from '@klipper/bow/mixins/Registrable';
import {getFieldErrors} from '@klipper/bow/utils/error';
import {getPropertyFromItem, setReactiveDeepValue} from '@klipper/bow/utils/object';
import {RuleValidate} from '@klipper/bow/validator/Rule';
import {HttpClientRequestError} from '@klipper/http-client/errors/HttpClientRequestError';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class StandardViewFieldable<V = any> extends mixins(
    RegistrableInject<'standardView', any>('standardView'),
) {
    @Prop({type: String, required: true})
    public name!: string;

    @Prop({type: String})
    public propertyPath!: string;

    @Prop({type: String})
    public label!: string;

    @Prop({type: String, default: '~'})
    public defaultValue!: string;

    @Prop({type: Boolean, default: false})
    public required!: boolean;

    @Prop({type: Boolean, default: false})
    public translatable!: boolean;

    @Prop({type: Boolean, default: false})
    public readonly!: boolean;

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

    protected errors: string[] = [];

    private value: Dictionary<V>|null = null;

    private metadata: string|null = null;

    private currentLocale: string|null = null;

    private editMode: boolean = false;

    private disabled: boolean = false;

    private push!: () => Promise<void>;

    protected get fieldValue(): any {
        return this.value ? getPropertyFromItem(this.value, this.genPropertyPath) : undefined;
    }

    protected set fieldValue(value: any) {
        if (typeof this.value === 'object') {
            setReactiveDeepValue(this.value, this.genPropertyPath, value);
        }
    }

    protected get isMetadataInitialized(): boolean {
        return undefined === this.$store.state.metadata || this.$store.state.metadata.initialized;
    }

    protected get isEmpty(): boolean {
        return !this.value || !this.fieldValue;
    }

    protected get isRequired(): boolean {
        if (this.required) {
            return true;
        }

        if (!this.isMetadataInitialized || !this.metadata || !this.$store.state.metadata.metadatas[this.metadata]) {
            return false;
        }

        const meta = this.$store.state.metadata.metadatas[this.metadata] as ObjectMetadata;

        return !!meta.fields[this.name] && meta.fields[this.name].required;
    }

    protected get isTranslatable(): boolean {
        if (this.translatable) {
            return true;
        }

        if (!this.isMetadataInitialized || !this.metadata || !this.$store.state.metadata.metadatas[this.metadata]) {
            return false;
        }

        const meta = this.$store.state.metadata.metadatas[this.metadata] as ObjectMetadata;

        return meta.translatable && !!meta.fields[this.name] && meta.fields[this.name].translatable;
    }

    protected get isReadonly(): boolean {
        if (this.readonly) {
            return true;
        }

        if (!this.isMetadataInitialized || !this.metadata || !this.$store.state.metadata.metadatas[this.metadata]) {
            return false;
        }

        const meta = this.$store.state.metadata.metadatas[this.metadata] as ObjectMetadata;

        return !!meta.fields[this.name] && meta.fields[this.name].readOnly;
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

        return this.isMetadataInitialized && this.metadata
            ? this.$metadata.getFieldOrAssociationLabel(this.metadata, this.name)
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
            'empty': !this.disabled && this.isEmpty,
            'edit-mode': !this.isReadonly && this.editMode,
            'edit-label-required': this.isRequired,
            'edit-translate': this.isTranslatable && this.currentLocale ? this.currentLocale : undefined,
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
        return Object.assign({
            'name': this.name,
            'disabled': this.disabled,
            'error-messages': this.errors,
            'rules': this.genRules,
            'autofocus': this.autofocus,
        }, this.editProps || {});
    }

    protected get genEditListeners(): Dictionary<any> {
        return Object.assign({
            keydown: async (e: KeyboardEvent) => {
                if ('Enter' === e.key) {
                    await this.push();
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

    public setMetadata(metadata?: string): void {
        this.metadata = metadata || null;
    }

    public setCurrentLocale(currentLocale: string): void {
        this.currentLocale = currentLocale;
    }

    public setEditMode(editMode: boolean): void {
        this.editMode = editMode;
    }

    public setDisabled(disabled: boolean): void {
        this.disabled = disabled;
    }

    public setValue(value: Dictionary<V>|null): void {
        this.value = value;
    }

    public setError(error: HttpClientRequestError|null): void {
        this.errors = getFieldErrors(this.name, error);
    }

    public setPushFunction(push: () => Promise<void>): void {
        this.push = push;
    }

    protected getDefaultRules(): RuleValidate[] {
        return [];
    }
}
