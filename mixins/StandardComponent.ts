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
import {StandardDeleteRequestDataEvent} from '@klipper/bow/http/event/StandardDeleteRequestDataEvent';
import {StandardFetchRequestDataEvent} from '@klipper/bow/http/event/StandardFetchRequestDataEvent';
import {StandardPushRequestDataEvent} from '@klipper/bow/http/event/StandardPushRequestDataEvent';
import {StandardDeleteRequestDataFunction} from '@klipper/bow/http/request/StandardDeleteRequestDataFunction';
import {StandardFetchRequestDataFunction} from '@klipper/bow/http/request/StandardFetchRequestDataFunction';
import {StandardPushRequestDataFunction} from '@klipper/bow/http/request/StandardPushRequestDataFunction';
import {ObjectMetadata} from '@klipper/bow/metadata/ObjectMetadata';
import {AjaxFormContent} from '@klipper/bow/mixins/http/AjaxFormContent';
import {provide as RegistrableProvide} from '@klipper/bow/mixins/Registrable';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {StandardViewFieldable} from '@klipper/bow/mixins/StandardViewFieldable';
import {StandardViewData} from '@klipper/bow/standardView/StandardViewData';
import {StandardViewItem} from '@klipper/bow/standardView/StandardViewItem';
import {consoleWarn} from '@klipper/bow/utils/console';
import {deepMerge} from '@klipper/bow/utils/object';
import {redirectIfExist, replaceRouteQuery, restoreRouteQuery} from '@klipper/bow/utils/router';
import {VForm} from '@klipper/bow/vuetify/VForm';
import {Canceler} from '@klipper/http-client/Canceler';
import {mixins} from 'vue-class-component';
import {Component, Prop, Ref, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class StandardComponent extends mixins(
    AjaxFormContent,
    SlotWrapper,
    RegistrableProvide('standardView'),
) {
    @Prop({type: Function})
    public fetchRequest!: StandardFetchRequestDataFunction|undefined;

    @Prop({type: [Function, Boolean], default: undefined})
    public pushRequest!: StandardPushRequestDataFunction|false|undefined;

    @Prop({type: Function})
    public dataModelTransformer!: DataTransformerFunction|undefined;

    @Prop({type: [Function, Boolean], default: undefined})
    public deleteRequest!: StandardDeleteRequestDataFunction|false|undefined;

    @Prop({type: Boolean, default: false})
    public loader!: boolean;

    @Prop({type: String})
    public metadata!: string;

    @Prop({type: String, default: 'form'})
    public formQueryPrefix!: string;

    @Ref('form')
    protected readonly formRef!: VForm;

    protected editMode: boolean = false;

    protected data: Dictionary<any>|null = null;

    protected backupData: Dictionary<any>|null = null;

    protected selectedLocale: string|null = null;

    protected newLocale: string|null = null;

    protected standardItems: StandardViewItem[] = [];

    protected standardFields: StandardViewFieldable[] = [];

    protected retryRefresh: boolean = false;

    protected replaceLocaleRoute: boolean = false;

    protected errorExcludedFields: string[] = [];

    protected get isMetadataInitialized(): boolean {
        return undefined === this.$store.state.metadata || this.$store.state.metadata.initialized;
    }

    protected get genSlotProps(): any {
        return {
            id: this.id,
            data: this.data,
            dataAvailableLocales: this.dataAvailableLocales,
            isCreate: this.isCreate,
            isTranslatable: this.isTranslatable,
            currentLocale: this.currentLocale,
            selectedLocale: this.selectedLocale,
            newLocale: this.newLocale,
            findSelectedLocale: this.findSelectedLocale,
            $form: this.formRef,
            editMode: this.editMode,
            toggleEdit: this.toggleEdit,
            enableEdit: this.enableEdit,
            cancelEdit: this.cancelEdit,
            loading: this.loading,
            fetchLoading: this.fetchLoading,
            pushLoading: this.pushLoading,
            showError: this.showError,
            errorCode: this.errorCode,
            errorMessage: this.errorMessage,
            fieldErrors: this.fieldErrors,
            refresh: this.refresh,
            push: this.push,
        };
    }

    protected get isCreate(): boolean {
        return !this.data || !this.data.id;
    }

    protected get id(): string|number|undefined {
        return this.data && this.data.id ? this.data.id : undefined;
    }

    protected get hasPushAction(): boolean {
        return !!this.pushRequest;
    }

    protected get hasDeleteAction(): boolean {
        return !!this.deleteRequest;
    }

    protected get fetchLoading(): boolean {
        return this.loading && !this.editMode;
    }

    protected get pushLoading(): boolean {
        return this.loading && this.editMode;
    }

    protected get showError(): boolean {
        return (this.loader && !this.data)
            || (this.loader && !!this.previousError);
    }

    protected get isTranslatable(): boolean {
        return !!this.metadata && this.$metadata.isTranslatable(this.metadata);
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
        return {
            metadata: this.metadata,
            currentLocale: this.currentLocale,
            editMode: this.editMode,
            loading: this.loading,
            isCreate: this.isCreate,
            id: this.id || null,
            data: this.data,
            error: this.previousError,
            pushAction: this.push,
        };
    }

    protected get objectMetadata(): ObjectMetadata|undefined {
        if (!this.isMetadataInitialized || !this.metadata || !this.$store.state.metadata.metadatas[this.metadata]) {
            return undefined;
        }

        return this.$store.state.metadata.metadatas[this.metadata];
    }

    public register(standardItem: StandardViewItem): void {
        this.standardItems.push(standardItem);

        if (this.isFieldableItem(standardItem)) {
            this.standardFields.push(standardItem as StandardViewFieldable);
        }

        standardItem.setStandardData(this.genStandardData);
    }

    public unregister(standardItem: StandardViewItem): void {
        if (this.standardItems.find((i: any) => i._uid === (standardItem as any)._uid)) {
            this.standardItems = this.standardItems.filter((i: any) => i._uid !== (standardItem as any)._uid);
        }

        if (this.isFieldableItem(standardItem)) {
            if (this.standardFields.find((i: any) => i._uid === (standardItem as any)._uid)) {
                this.standardFields = this.standardFields.filter((i: any) => i._uid !== (standardItem as any)._uid);
            }
        }
    }

    public async created(): Promise<void> {
        this.selectedLocale = !!this.$route.query.lang ? this.$route.query.lang as string : null;
        await this.refresh();
    }

    public async mounted(): Promise<void> {
        window.addEventListener('keyup', this.onGlobalKeyDown);
        this.selectedLocale = this.findSelectedLocale;
    }

    public async destroyed(): Promise<void> {
        window.removeEventListener('keyup', this.onGlobalKeyDown);
        this.cancelEdit();
    }

    public enableEdit(): void {
        this.editMode = true;
    }

    public cancelEdit(createRouterBack: boolean = false): void {
        if (this.isCreate && createRouterBack) {
            if (this.$routerBack) {
                this.$routerBack.back();
            }

            return;
        }

        this.resetPreviousError();
        this.editMode = false;
        this.data = deepMerge({}, this.backupData);
        this.newLocale = null;

        if (this.replaceLocaleRoute) {
            replaceRouteQuery({
                lang: this.selectedLocale !== this.$store.state.i18n.locale ? this.selectedLocale : undefined,
            }, this.$route);
        }
    }

    public toggleEdit(): void {
        if (this.editMode) {
            this.cancelEdit();
        } else {
            this.enableEdit();
        }
    }

    public async refresh(): Promise<void> {
        const id: string = this.$route.params.id;
        let fetchRequest = this.fetchRequest;
        this.retryRefresh = false;

        if (!!this.metadata && !this.objectMetadata) {
            this.retryRefresh = true;

            return;
        }

        if (undefined === fetchRequest) {
            fetchRequest = this.standardFetchRequest;
        }

        if (id && !!fetchRequest && !this.loading && !this.isCreate) {
            this.data = await this.fetchData(async (canceler) => {
                const event = new StandardFetchRequestDataEvent();
                event.id = id;
                event.canceler = canceler;
                event.locale = this.selectedLocale || undefined;
                event.currentLocale = this.currentLocale;
                event.objectMetadata = this.objectMetadata;

                return !fetchRequest ? null : await fetchRequest(event);
            }, false);
            this.backupData = deepMerge({}, this.data);
        } else if (!id || this.isCreate) {
            this.data = {};
            this.backupData = {};
            this.injectRouteQueryData();
            this.enableEdit();
        }

        this.loading = false;

        if (this.selectedLocale
            && this.dataAvailableLocales
            && this.dataAvailableLocales.length > 0
            && this.dataAvailableLocales.indexOf(this.selectedLocale) < 0
        ) {
            this.selectedLocale = this.dataAvailableLocales[0];

            if (this.replaceLocaleRoute) {
                replaceRouteQuery({
                    lang: this.selectedLocale !== this.$store.state.i18n.locale ? this.selectedLocale : undefined,
                }, this.$route);
            }
        }
    }

    public async push(): Promise<void> {
        let pushRequest = this.pushRequest;

        if (undefined === pushRequest && !!this.objectMetadata) {
            pushRequest = this.standardPushRequest;
        }

        if (pushRequest && !this.loading) {
            if (this.isValidForm()) {
                const locale = this.newLocale || this.selectedLocale;

                this.updateErrorExcludedFields();

                const res = await this.fetchData(async (canceler) => {
                    const event = new StandardPushRequestDataEvent();
                    event.id = this.id;
                    event.data = this.data as Dictionary<any>;
                    event.canceler = canceler;
                    event.locale = null !== locale && (!!this.newLocale || locale !== this.$store.state.i18n.locale)
                        ? locale
                        : undefined;
                    event.currentLocale = this.currentLocale;
                    event.objectMetadata = this.objectMetadata;
                    event.dataTransformed = deepMerge({}, this.data || {});

                    if (!!this.data && !!this.objectMetadata) {
                        event.dataTransformed = await this.transformModelData(
                            this.data,
                            event.dataTransformed,
                            this.objectMetadata,
                            this.currentLocale,
                        );
                    }

                    return !pushRequest ? null : await pushRequest(event);
                }, false);

                if (res) {
                    if (this.isCreate) {
                        if (!await redirectIfExist(this.$router)) {
                            this.$emit('created', res);
                            this.$emit('upserted', res);
                        }

                        return;
                    }

                    this.data = res;
                    this.backupData = deepMerge({}, this.data);
                    this.cancelEdit();

                    this.selectedLocale = locale;

                    replaceRouteQuery({
                        lang: this.selectedLocale !== this.$store.state.i18n.locale ? this.selectedLocale : undefined,
                    }, this.$route);

                    this.$emit('updated', res);
                    this.$emit('upserted', res);
                }
            }
        } else {
            this.cancelEdit();
        }

        this.loading = false;
    }

    protected isFieldableItem(standardItem: StandardViewItem|StandardViewFieldable): boolean {
        return undefined !== (standardItem as any).name;
    }

    protected async onLocaleChange(locale: string, newLocale?: boolean): Promise<void> {
        replaceRouteQuery({
            lang: locale !== this.$store.state.i18n.locale ? locale : undefined,
        }, this.$route);

        if (newLocale) {
            if (this.data && this.data.available_locales) {
                this.data.available_locales.push(locale);
                this.newLocale = locale;
                this.enableEdit();
            }
        } else {
            this.selectedLocale = locale;
            await this.refresh();
        }
    }

    protected async onLocaleDelete(locale: string): Promise<void> {
        if ((this.hasDeleteAction || !!this.objectMetadata) && undefined !== this.id) {
            const res = await this.fetchData(async (canceler) => {
                await this.deleteItem(this.id as string|number, canceler, locale);

                return true;
            }, true);

            if (res) {
                await this.refresh();
            }
        }
    }

    protected onGlobalKeyDown(event: KeyboardEvent): void {
        if (event.shiftKey && event.altKey && event.code === 'KeyE') {
            this.toggleEdit();
        }
    }

    protected onKeyDown(event: KeyboardEvent): void {
        if (event.code === 'Escape' && this.editMode) {
            this.cancelEdit();
        }
    }

    protected async deleteItem(id: string|number, canceler: Canceler, locale?: string): Promise<string|number|undefined> {
        let deleteRequest = this.deleteRequest;

        if (undefined === deleteRequest && !!this.objectMetadata) {
            deleteRequest = this.standardDeleteRequest;
        }

        if (deleteRequest && (!this.loading || !!locale) && !this.isCreate) {
            const event = new StandardDeleteRequestDataEvent();
            event.id = id;
            event.canceler = canceler;
            event.locale = locale;
            event.currentLocale = this.currentLocale;
            event.objectMetadata = this.objectMetadata;

            await deleteRequest(event);

            return id;
        }
    }

    protected async onDeletedItem(id: string|number): Promise<void> {
        if (!await redirectIfExist(this.$router)) {
            this.$emit('deleted', id);
        }
    }

    protected updateErrorExcludedFields(): void {
        const fields: string[] = [];

        if (this.formRef && this.formRef.inputs) {
            this.formRef.inputs.forEach((node) => {
                if (node.$attrs.name) {
                    fields.push(node.$attrs.name);
                }
            });
        }

        this.errorExcludedFields = fields;
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

    @Watch('isMetadataInitialized')
    protected async watchIsMetadataInitialized(value: boolean): Promise<void> {
        if (value) {
            this.selectedLocale = this.isTranslatable ? this.findSelectedLocale : null;

            if (this.retryRefresh) {
                await this.refresh();
            }
        }
    }

    @Watch('metadata')
    @Watch('currentLocale')
    @Watch('editMode')
    @Watch('loading')
    @Watch('data')
    @Watch('previousError')
    protected watchStandardDataValues(): void {
        this.standardItems.forEach((standardItem: StandardViewItem) => {
            standardItem.setStandardData(this.genStandardData);
        });
    }

    protected async standardFetchRequest(event: StandardFetchRequestDataEvent): Promise<object|null> {
        if (!event.objectMetadata || !event.objectMetadata.pluralName) {
            consoleWarn('Standard View component requires metadata attribute to use the default fetch request');

            return null;
        }

        return await this.$api.request({
            method: 'GET',
            url: '/{organization}/' + event.objectMetadata.pluralName + '/' + event.id,
            params: event.getRequestParams(),
        }, event.canceler);
    }

    protected async standardPushRequest<D = Dictionary<any>, T = Dictionary<any>>(event: StandardPushRequestDataEvent<D, T>): Promise<Dictionary<any>|null> {
        if (!event.objectMetadata || !event.objectMetadata.pluralName) {
            consoleWarn('Standard View component requires metadata attribute to use the default push request');

            return null;
        }

        return await this.$api.request({
            method: event.getMethod(),
            url: event.getPushUrl('/{organization}/' + event.objectMetadata.pluralName),
            params: event.getRequestParams(),
            data: event.dataTransformed,
        }, event.canceler);
    }

    protected async transformModelData(data: Dictionary<any>, dataTransformed: Dictionary<any>, objectMetadata: ObjectMetadata, currentLocale: string): Promise<Dictionary<any>> {
        const transformerEvent = new DataTransformerEvent();
        transformerEvent.currentLocale = currentLocale;
        transformerEvent.objectMetadata = objectMetadata;
        transformerEvent.data = data;
        transformerEvent.originalData = this.backupData || data;
        transformerEvent.dataTransformed = dataTransformed;
        transformerEvent.inputNames = [];

        for (const standardItem of this.standardFields) {
            if (!transformerEvent.inputNames.includes((standardItem as any).name)) {
                transformerEvent.inputNames.push((standardItem as any).name);
            }
        }

        await this.$dataTransformer.transform(transformerEvent);

        if (!!this.dataModelTransformer) {
            await this.dataModelTransformer(transformerEvent);
        }

        return transformerEvent.dataTransformed;
    }

    protected async standardDeleteRequest(event: StandardDeleteRequestDataEvent): Promise<void> {
        if (!event.objectMetadata || !event.objectMetadata.pluralName) {
            consoleWarn('Standard View component requires metadata attribute to use the default delete request');

            return;
        }

        await this.$api.request({
            url: '/{organization}/' + event.objectMetadata.pluralName + '/' + event.id,
            method: 'DELETE',
            params: event.getRequestParams(),
        }, event.canceler);
    }
}
