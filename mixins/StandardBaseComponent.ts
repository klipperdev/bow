/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {DataTransformerEvent} from '@klipper/bow/dataTransformer/event/DataTransformerEvent';
import {DataTransformerFunction} from '@klipper/bow/dataTransformer/event/DataTransformerFunction';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {ObjectMetadata} from '@klipper/bow/metadata/ObjectMetadata';
import {provide as RegistrableProvide} from '@klipper/bow/mixins/Registrable';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {StandardViewFieldable} from '@klipper/bow/mixins/StandardViewFieldable';
import {createStandardViewData, StandardViewData} from '@klipper/bow/standardView/StandardViewData';
import {StandardViewItem} from '@klipper/bow/standardView/StandardViewItem';
import {deepMerge} from '@klipper/bow/utils/object';
import {replaceRouteQuery, restoreRouteQuery} from '@klipper/bow/utils/router';
import {VForm} from '@klipper/bow/vuetify/VForm';
import {mixins} from 'vue-class-component';
import {Component, Prop, Ref, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class StandardBaseComponent extends mixins(
    SlotWrapper,
    RegistrableProvide('standardView', false, 'standardItemRegister', 'standardItemUnregister'),
) {
    @Prop({type: String, default: undefined})
    public metadata!: string|undefined;

    @Prop({type: String, default: 'form'})
    public formQueryPrefix!: string;

    @Prop({type: Function})
    public dataModelTransformer!: DataTransformerFunction|undefined;

    @Prop({type: Boolean, default: false})
    public vertical!: boolean;

    @Prop({type: Boolean, default: false})
    public dense!: boolean;

    @Prop({type: Boolean, default: false})
    public formDisabled!: boolean;

    @Prop({type: Boolean, default: false})
    public formReadOnly!: boolean;

    @Ref('form')
    protected readonly formRef!: VForm;

    protected editMode: boolean = false;

    protected data: Dictionary<any>|null = null;

    protected backupData: Dictionary<any>|null = null;

    protected selectedLocale: string|null = null;

    protected newLocale: string|null = null;

    protected standardItems: StandardViewItem[] = [];

    protected standardFields: StandardViewFieldable[] = [];

    protected replaceLocaleRoute: boolean = false;

    protected errorExcludedFields: string[] = [];

    protected get dataReactive(): Dictionary<any> {
        return this.data ?? {};
    }

    protected get metadataName(): string|undefined {
        return this.metadata;
    }

    protected get isCreate(): boolean {
        return !this.data || !this.data.id;
    }

    protected get isDense(): boolean {
        return this.dense;
    }

    protected get isVertical(): boolean {
        return this.vertical;
    }

    protected get isMetadataInitialized(): boolean {
        return undefined === this.$store.state.metadata || this.$store.state.metadata.initialized;
    }

    protected get isTranslatable(): boolean {
        return !!this.metadataName && this.$metadata.isTranslatable(this.metadataName);
    }

    protected get objectMetadata(): ObjectMetadata|undefined {
        if (!this.isMetadataInitialized || !this.metadataName || !this.$store.state.metadata.metadatas[this.metadataName]) {
            return undefined;
        }

        return this.$store.state.metadata.metadatas[this.metadataName];
    }

    protected get id(): string|number|undefined {
        return this.data && this.data.id ? this.data.id : undefined;
    }

    protected get dataAvailableLocales(): string[]|undefined {
        return this.data && this.data.available_locales ? this.data.available_locales : undefined;
    }

    protected get findSelectedLocale(): string|null {
        if (this.isTranslatable && undefined !== this.$route.query.lang) {
            return Array.isArray(this.$route.query.lang) ? this.$route.query.lang.join('') : this.$route.query.lang as string;
        }

        return null;
    }

    protected get currentLocale(): string {
        const locale = this.$store.state.i18n.locale;

        if (!this.isTranslatable) {
            return locale;
        }

        if (this.newLocale) {
            return this.newLocale;
        }

        if (this.selectedLocale) {
            return this.selectedLocale;
        }

        if (this.dataAvailableLocales && this.dataAvailableLocales.length > 0 && this.dataAvailableLocales.indexOf(locale) < 0) {
            return this.dataAvailableLocales[0];
        }

        return this.$store.state.i18n.locale;
    }

    protected get genStandardData(): StandardViewData {
        return createStandardViewData({
            metadata: this.metadataName || null,
            currentLocale: this.currentLocale,
            editMode: this.editMode,
            vertical: this.isVertical,
            dense: this.isDense,
            isCreate: this.isCreate,
            id: this.id || null,
            data: this.data,
        });
    }

    protected get genDataModelTransformer(): DataTransformerFunction|undefined {
        return this.dataModelTransformer;
    }

    public async created(): Promise<void> {
        this.selectedLocale = !!this.$route.query.lang ? this.$route.query.lang as string : null;
    }

    public standardItemRegister(standardItem: StandardViewItem): void {
        if (!this.standardItems.find((i: Vue) => i._uid === standardItem._uid)) {
            this.standardItems.push(standardItem);
        }

        if (this.isFieldableItem(standardItem)
            && !this.standardFields.find((i: Vue) => i._uid === standardItem._uid)
        ) {
            this.standardFields.push(standardItem as StandardViewFieldable);
        }

        standardItem.setStandardData(this.genStandardData);
    }

    public standardItemUnregister(standardItem: StandardViewItem): void {
        if (this.standardItems.find((i: any) => i._uid === (standardItem as any)._uid)) {
            this.standardItems = this.standardItems.filter((i: any) => i._uid !== (standardItem as any)._uid);
        }

        if (this.isFieldableItem(standardItem)) {
            if (this.standardFields.find((i: any) => i._uid === (standardItem as any)._uid)) {
                this.standardFields = this.standardFields.filter((i: any) => i._uid !== (standardItem as any)._uid);
            }
        }
    }

    public toggleEdit(): void {
        if (this.editMode) {
            this.cancelEdit();
        } else {
            this.enableEdit();
        }
    }

    public enableEdit(data: Dictionary<any>|null = null): void {
        this.backupData = typeof this.data === 'object' ? this.data : null;
        this.data = typeof this.data === 'object' ? deepMerge({}, this.backupData) : null;

        if (!!data) {
            Object.assign(this.data || {}, data);
        }

        this.editMode = true;
    }

    public cancelEdit(createRouterBack: boolean = false): void {
        if (this.isCreate && createRouterBack) {
            if (this.$routerBack) {
                this.$routerBack.back().then();
            }

            return;
        }

        this.beforeCancelEdit();
        this.editMode = false;
        this.data = typeof this.backupData === 'object' ? this.backupData : null;
        this.backupData = null;
        this.newLocale = null;

        if (this.replaceLocaleRoute) {
            replaceRouteQuery({
                lang: this.selectedLocale !== this.$store.state.i18n.locale ? this.selectedLocale : undefined,
            }, this.$route);
        }

        this.$emit('input', this.data);
        this.$emit('canceled', this.data);
    }

    protected async init(): Promise<void> {
        // Override the method
    }

    protected beforeCancelEdit(): void {
        // Override the method
    }

    protected isFieldableItem(standardItem: StandardViewItem|StandardViewFieldable): boolean {
        return undefined !== (standardItem as any).isField && true === (standardItem as any).isField;
    }

    protected injectRouteQueryData(): void {
        const startPos = this.formQueryPrefix ? this.formQueryPrefix.length + 1 : 0;

        for (const key in this.$route.query) {
            if (!this.$route.query.hasOwnProperty(key)) {
                continue;
            }

            if (undefined === this.formQueryPrefix || key.startsWith(this.formQueryPrefix)) {
                const dataProp = key.substring(startPos);
                const queryValue = restoreRouteQuery(dataProp, this.$route, this.formQueryPrefix, undefined, 'any');

                if (undefined !== queryValue && null !== this.data) {
                    this.data[dataProp] = queryValue;
                }
            }
        }
    }

    protected async getTransformModelData(): Promise<Dictionary<any>> {
        const dataTransformed: Dictionary<any> = deepMerge({}, this.data || {});

        if (!this.objectMetadata || !this.data) {
            return dataTransformed;
        }

        const transformerEvent = new DataTransformerEvent(
            this.currentLocale,
            this.objectMetadata,
            this.backupData || this.data,
            this.data,
            dataTransformed,
        );

        for (const standardItem of this.standardFields) {
            if (!transformerEvent.inputNames.includes((standardItem as any).name)) {
                transformerEvent.inputNames.push((standardItem as any).name);
            }
        }

        await this.$dataTransformer.transform(transformerEvent);

        if (!!this.genDataModelTransformer) {
            await this.genDataModelTransformer(transformerEvent);
        }

        return transformerEvent.dataTransformed;
    }

    @Watch('metadata')
    @Watch('currentLocale')
    @Watch('editMode')
    @Watch('data')
    protected watchStandardDataValues(): void {
        this.standardItems.forEach((standardItem: StandardViewItem) => {
            standardItem.setStandardData(this.genStandardData);
        });
    }

    @Watch('isMetadataInitialized', {immediate: true})
    protected async watchIsMetadataInitialized(value: boolean): Promise<void> {
        if (value) {
            this.selectedLocale = this.isTranslatable ? this.findSelectedLocale : null;

            await this.init();
        }
    }
}
