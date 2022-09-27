/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {provide as RegistrableProvide} from '@klipper/bow/composables/mixins/registrable';
import {SlotWrapper} from '@klipper/bow/composables/mixins/slotWrapper';
import {DataTransformerEvent} from '@klipper/bow/dataTransformer/event/DataTransformerEvent';
import {DataTransformerFunction} from '@klipper/bow/dataTransformer/event/DataTransformerFunction';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {ObjectMetadata} from '@klipper/bow/metadata/ObjectMetadata';
import {StandardViewFieldable} from '@klipper/bow/mixins/StandardViewFieldable';
import {StandardViewData} from '@klipper/bow/standardView/StandardViewData';
import {StandardViewItem} from '@klipper/bow/standardView/StandardViewItem';
import {deepMerge} from '@klipper/bow/utils/object';
import {replaceRouteQuery, restoreRouteQuery} from '@klipper/bow/utils/router';
import Vue, {PropType} from 'vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */

interface Props {
    metadata?: string;
    formQueryPrefix: string;
    dataModelTransformer?: DataTransformerFunction;
    vertical: boolean;
    dense: boolean;
    formDisabled: boolean;
    formReadOnly: boolean;
}

interface Data {
    editMode: boolean;
    data: Dictionary<any>|null;
    backupData: Dictionary<any>|null;
    selectedLocale: string|null;
    newLocale: string|null;
    standardItems: StandardViewItem[];
    standardFields: StandardViewFieldable[];
    replaceLocaleRoute: boolean;
    errorExcludedFields: string[];
}

interface Computed {
    get dataReactive(): Dictionary<any>;
    get metadataName(): string|undefined;
    get isCreate(): boolean;
    get isDense(): boolean;
    get isVertical(): boolean;
    get isMetadataInitialized(): boolean;
    get isTranslatable(): boolean;
    get objectMetadata(): ObjectMetadata|undefined;
    get id(): string|number|undefined;
    get dataAvailableLocales(): string[]|undefined;
    get findSelectedLocale(): string|null;
    get currentLocale(): string;
    get genStandardData(): StandardViewData;
    get genDataModelTransformer(): DataTransformerFunction|undefined;
}

interface Methods {
    standardItemRegister(standardItem: StandardViewItem): void;
    standardItemUnregister(standardItem: StandardViewItem): void;
    init(): Promise<void>;
    mergeData(data: Dictionary<any>|null): Dictionary<any>|null;
    toggleEdit(): void;
    enableEdit(data: Dictionary<any>|null): void;
    cancelEdit(createRouterBack: boolean): void;
    beforeCancelEdit(): void;
    isFieldableItem(standardItem: StandardViewItem|StandardViewFieldable): boolean;
    injectRouteQueryData(): void;
    getTransformModelData(): Promise<Dictionary<any>>;
    transformModelData(data: Dictionary<any>|null, backupData: Dictionary<any>|null): Promise<Dictionary<any>>;
}

export const StandardBaseComponent = Vue.extend<Data, Methods, Computed, Props>({
    name: 'standardBaseComponent',

    mixins: [
        SlotWrapper,
        RegistrableProvide('standardView', false, 'standardItemRegister', 'standardItemUnregister'),
    ],

    props: {
        metadata: {
            type: String,
        },

        formQueryPrefix: {
            type: String,
            default: 'form',
        },

        dataModelTransformer: {
            type: Function as PropType<DataTransformerFunction|undefined>,
            default: undefined,
        },

        vertical: {
            type: Boolean,
            default: false,
        },

        dense: {
            type: Boolean,
            default: false,
        },

        formDisabled: {
            type: Boolean,
            default: false,
        },

        formReadOnly: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            editMode: false,
            data: null,
            backupData: null,
            selectedLocale: null,
            newLocale: null,
            standardItems: [],
            standardFields: [],
            replaceLocaleRoute: false,
            errorExcludedFields: [],
        };
    },

    computed: {
        dataReactive(): Dictionary<any> {
            return this.data ?? {};
        },

        metadataName(): string|undefined {
            return this.metadata;
        },

        isCreate(): boolean {
            return !this.data || !this.data.id;
        },

        isDense(): boolean {
            return this.dense;
        },

        isVertical(): boolean {
            return this.vertical;
        },

        isMetadataInitialized(): boolean {
            return undefined === this.$store.state.metadata || this.$store.state.metadata.initialized;
        },

        isTranslatable(): boolean {
            return !!this.metadataName && this.$metadata.isTranslatable(this.metadataName);
        },

        objectMetadata(): ObjectMetadata|undefined {
            if (!this.isMetadataInitialized || !this.metadataName || !this.$store.state.metadata.metadatas[this.metadataName]) {
                return undefined;
            }

            return this.$store.state.metadata.metadatas[this.metadataName];
        },

        id(): string|number|undefined {
            return this.data && this.data.id ? this.data.id : undefined;
        },

        dataAvailableLocales(): string[]|undefined {
            return this.data && this.data.available_locales ? this.data.available_locales : undefined;
        },

        findSelectedLocale(): string|null {
            if (this.isTranslatable && undefined !== this.$route.query.lang) {
                return Array.isArray(this.$route.query.lang) ? this.$route.query.lang.join('') : this.$route.query.lang as string;
            }

            return null;
        },

        currentLocale(): string {
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
        },

        genStandardData(): StandardViewData {
            return {
                metadata: this.metadataName || null,
                currentLocale: this.currentLocale,
                editMode: this.editMode,
                vertical: this.isVertical,
                dense: this.isDense,
                loading: false,
                showLoading: false,
                isCreate: this.isCreate,
                id: this.id || null,
                data: this.data,
                error: null,
                pushAction: async () => {},
            };
        },

        genDataModelTransformer(): DataTransformerFunction|undefined {
            return this.dataModelTransformer;
        },
    },

    async created(): Promise<void> {
        this.selectedLocale = !!this.$route.query.lang ? this.$route.query.lang as string : null;
    },

    mounted(): void {
        this.$watch(
            (vm: any) => [vm.metadata, vm.currentLocale, vm.editMode, vm.data],
            () => {
                this.standardItems.forEach((standardItem: StandardViewItem) => {
                    standardItem.setStandardData(this.genStandardData);
                });
            }
        );
    },

    destroyed(): void {

    },

    methods: {
        standardItemRegister(standardItem: StandardViewItem): void {
            if (!this.standardItems.find((i: Vue) => i._uid === standardItem._uid)) {
                this.standardItems.push(standardItem);
            }

            if (this.isFieldableItem(standardItem)
                && !this.standardFields.find((i: Vue) => i._uid === standardItem._uid)
            ) {
                this.standardFields.push(standardItem as StandardViewFieldable);
            }

            standardItem.setStandardData(this.genStandardData);
        },

        standardItemUnregister(standardItem: StandardViewItem): void {
            if (this.standardItems.find((i: any) => i._uid === (standardItem as any)._uid)) {
                this.standardItems = this.standardItems.filter((i: any) => i._uid !== (standardItem as any)._uid);
            }

            if (this.isFieldableItem(standardItem)) {
                if (this.standardFields.find((i: any) => i._uid === (standardItem as any)._uid)) {
                    this.standardFields = this.standardFields.filter((i: any) => i._uid !== (standardItem as any)._uid);
                }
            }
        },

        mergeData(data: Dictionary<any>|null = null): Dictionary<any>|null {
            this.data = typeof this.data === 'object' && typeof data === 'object'
                ? deepMerge(this.data, data)
                : null;

            return this.data;
        },

        toggleEdit(): void {
            if (this.editMode) {
                this.cancelEdit();
            } else {
                this.enableEdit();
            }
        },

        enableEdit(data: Dictionary<any>|null = null): void {
            this.backupData = typeof this.data === 'object' ? this.data : null;
            this.data = typeof this.data === 'object' ? deepMerge({}, this.backupData) : null;

            if (!!data) {
                Object.assign(this.data || {}, data);
            }

            this.editMode = true;
        },

        cancelEdit(createRouterBack: boolean = false): void {
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
        },

        async init(): Promise<void> {
            // Override the method
        },

        beforeCancelEdit(): void {
            // Override the method
        },

        isFieldableItem(standardItem: StandardViewItem|StandardViewFieldable): boolean {
            return undefined !== (standardItem as any).isField && true === (standardItem as any).isField;
        },

        injectRouteQueryData(): void {
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
        },

        async getTransformModelData(): Promise<Dictionary<any>> {
            return await this.transformModelData(this.data, this.backupData);
        },

        async transformModelData(data: Dictionary<any>|null, backupData: Dictionary<any>|null = null): Promise<Dictionary<any>> {
            const dataTransformed: Dictionary<any> = deepMerge({}, data || {});

            if (!this.objectMetadata || !data) {
                return dataTransformed;
            }

            const transformerEvent = new DataTransformerEvent(
                this.currentLocale,
                this.objectMetadata,
                backupData || data,
                data,
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
        },
    },

    watch: {
        metadata() {
            this.standardItems.forEach((standardItem: StandardViewItem) => {
                standardItem.setStandardData(this.genStandardData);
            });
        },
        currentLocale() {
            this.standardItems.forEach((standardItem: StandardViewItem) => {
                standardItem.setStandardData(this.genStandardData);
            });
        },
        editMode() {
            this.standardItems.forEach((standardItem: StandardViewItem) => {
                standardItem.setStandardData(this.genStandardData);
            });
        },
        data() {
            this.standardItems.forEach((standardItem: StandardViewItem) => {
                standardItem.setStandardData(this.genStandardData);
            });
        },
        isMetadataInitialized: {
            immediate: true,
            async handler(value: boolean): Promise<void> {
                if (value) {
                    this.selectedLocale = this.isTranslatable ? this.findSelectedLocale : null;

                    await this.init();
                }
            },
        }
    },
});
