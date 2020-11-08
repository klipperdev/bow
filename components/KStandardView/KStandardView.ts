/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Component, Prop, Watch} from 'vue-property-decorator';
import {mixins} from 'vue-class-component';
import {AjaxFormContent} from '@klipper/bow/mixins/http/AjaxFormContent';
import {FetchRequestDataEvent} from '@klipper/bow/http/event/FetchRequestDataEvent';
import {FetchRequestDataFunction} from '@klipper/bow/http/request/FetchRequestDataFunction';
import {PushRequestDataEvent} from '@klipper/bow/http/event/PushRequestDataEvent';
import {PushRequestDataFunction} from '@klipper/bow/http/request/PushRequestDataFunction';
import {DeleteRequestDataEvent} from '@klipper/bow/http/event/DeleteRequestDataEvent';
import {DeleteRequestDataFunction} from '@klipper/bow/http/request/DeleteRequestDataFunction';
import {Canceler} from '@klipper/http-client/Canceler';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {VForm} from '@klipper/bow/vuetify/VForm';
import {getRequestErrorMessage} from '@klipper/bow/utils/error';
import {deepMerge} from '@klipper/bow/utils/object';
import {redirectIfExist, replaceRouteQuery, restoreRouteQuery} from '@klipper/bow/utils/router';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KStandardView extends mixins(
    AjaxFormContent,
    SlotWrapper,
) {
    @Prop({type: Function})
    public fetchRequest!: FetchRequestDataFunction|undefined;

    @Prop({type: Function})
    public pushRequest!: PushRequestDataFunction|undefined;

    @Prop({type: Function})
    public deleteRequest!: DeleteRequestDataFunction|undefined;

    @Prop({type: Boolean, default: false})
    public loader!: boolean;

    @Prop({type: String})
    public metadata!: string;

    @Prop({type: Boolean, default: false})
    public disableStandardActions!: boolean;

    @Prop({type: [Boolean, Function], default: true})
    public standardEditAction!: boolean|((data: Dictionary<any>|null) => boolean);

    @Prop({type: [Boolean, Function], default: true})
    public standardDeleteAction!: boolean|((data: Dictionary<any>|null) => boolean);

    @Prop({type: Boolean, default: false})
    public disableLocaleActions!: boolean;

    @Prop({type: String, default: 'form'})
    public formQueryPrefix!: string;

    @Prop({type: Boolean, default: false})
    public editModeKeepList!: boolean;

    public errorExcludedFields: string[] = [];

    private editMode: boolean = false;

    private data: Dictionary<any>|null = null;

    private backupData: Dictionary<any>|null = null;

    private selectedLocale: string|null = null;

    private newLocale: string|null = null;

    public get displayLists(): boolean {
        return !this.isCreate && (!this.editMode || (this.editMode && this.editModeKeepList));
    }

    public get bindSlotData(): any {
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
            $form: this.$refs.form,
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

    public get isCreate(): boolean {
        return !this.$route.params.id || 'create' === this.$route.params.id;
    }

    public get id(): string|number|undefined {
        const id = this.data && this.data.id ? this.data.id : this.$route.params.id;

        return 'create' !== id ? id : undefined;
    }

    public get displayStandardActions(): boolean {
        return !!this.$scopedSlots.standardActionsPrepend
            || !!this.$scopedSlots.standardActions
            || !!this.$scopedSlots.standardActionsAppend
            || this.displayStandardEditAction
            || this.displayStandardDeleteAction
        ;
    }

    public get displayStandardEditAction(): boolean {
        return !!this.pushRequest && !this.isCreate
            && (typeof this.standardEditAction === 'function' ? this.standardEditAction(this.data) : this.standardEditAction);
    }

    public get displayStandardDeleteAction(): boolean {
        return !!this.deleteRequest && !this.isCreate
            && (typeof this.standardDeleteAction === 'function' ? this.standardDeleteAction(this.data) : this.standardDeleteAction);
    }

    public get fetchLoading(): boolean {
        return this.loading && !this.editMode;
    }

    public get pushLoading(): boolean {
        return this.loading && this.editMode;
    }

    public get showError(): boolean {
        return (this.loader && !this.data)
            || (!this.loader && !!this.previousError);
    }

    public get errorCode(): number {
        return this.previousError ? this.previousError.statusCode : 0;
    }

    public get errorMessage(): string {
        if (this.previousError) {
            let message = '';

            if (this.errorCode > 0) {
                message = this.previousError.statusCode + ' ';
            }

            message += getRequestErrorMessage(this, this.previousError);

            return message;
        }

        return this.$t('error.404-page-not-found') as string;
    }

    public get isMetadataInitialized(): boolean {
        return undefined === this.$store.state.metadata || this.$store.state.metadata.initialized;
    }

    public get isTranslatable(): boolean {
        return !!this.metadata && this.$metadata.isTranslatable(this.metadata);
    }

    public get dataAvailableLocales(): string[]|undefined {
        return this.data && this.data.available_locales ? this.data.available_locales : undefined;
    }

    public get findSelectedLocale(): string|null {
        if (this.isTranslatable && undefined !== this.$route.query.lang) {
            return Array.isArray(this.$route.query.lang) ? this.$route.query.lang.join('') : this.$route.query.lang as string;
        }

        return null;
    }

    public get currentLocale(): string {
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

    public async onLocaleChange(locale: string, newLocale?: boolean): Promise<void> {
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

    public async onLocaleDelete(locale: string): Promise<void> {
        if (this.deleteRequest && undefined !== this.id) {
            const res = await this.fetchData(async (canceler) => {
                await this.deleteItem(this.id as string|number, canceler, locale);

                return true;
            }, true);

            if (res) {
                await this.refresh();
            }
        }
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

        replaceRouteQuery({
            lang: this.selectedLocale !== this.$store.state.i18n.locale ? this.selectedLocale : undefined,
        }, this.$route);
    }

    public toggleEdit(): void {
        if (this.editMode) {
            this.cancelEdit();
        } else {
            this.enableEdit();
        }
    }

    public onGlobalKeyDown(event: KeyboardEvent): void {
        if (event.shiftKey && event.altKey && event.code === 'KeyE') {
            this.toggleEdit();
        }
    }

    public onKeyDown(event: KeyboardEvent): void {
        if (event.code === 'Escape' && this.editMode) {
            this.cancelEdit();
        }
    }

    public async refresh(): Promise<void> {
        const id: string = this.$route.params.id;
        const fetchRequest = this.fetchRequest;

        if (id && fetchRequest && !this.loading && !this.isCreate) {
            this.data = await this.fetchData(async (canceler) => {
                const event = new FetchRequestDataEvent();
                event.id = id;
                event.canceler = canceler;
                event.locale = this.selectedLocale || undefined;

                return await fetchRequest(event);
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

            replaceRouteQuery({
                lang: this.selectedLocale !== this.$store.state.i18n.locale ? this.selectedLocale : undefined,
            }, this.$route);
        }
    }

    public async push(): Promise<void> {
        const pushRequest = this.pushRequest;

        if (pushRequest && !this.loading) {
            if (this.isValidForm()) {
                const locale = this.newLocale || this.selectedLocale;

                this.updateErrorExcludedFields();

                const res = await this.fetchData(async (canceler) => {
                    const event = new PushRequestDataEvent();
                    event.data = this.data as Dictionary<any>;
                    event.canceler = canceler;
                    event.locale = null !== locale && (!!this.newLocale || locale !== this.$store.state.i18n.locale)
                        ? locale
                        : undefined;

                    return await pushRequest(event);
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

    public async deleteItem(id: string|number, canceler: Canceler, locale?: string): Promise<string|number|undefined> {
        if (this.deleteRequest && (!this.loading || !!locale) && !this.isCreate) {
            const event = new DeleteRequestDataEvent();
            event.id = id;
            event.canceler = canceler;
            event.locale = locale;

            await this.deleteRequest(event);

            return id;
        }
    }

    public async onDeletedItem(id: string|number): Promise<void> {
        if (!await redirectIfExist(this.$router)) {
            this.$emit('deleted', id);
        }
    }

    private updateErrorExcludedFields(): void {
        const fields: string[] = [];

        if (this.$refs.form && (this.$refs.form as VForm).inputs) {
            (this.$refs.form as VForm).inputs.forEach((node) => {
                if (node.$attrs.name) {
                    fields.push(node.$attrs.name);
                }
            });
        }

        this.errorExcludedFields = fields;
    }

    private injectRouteQueryData(): void {
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
    private watchIsMetadataInitialized(value: boolean): void {
        if (value) {
            this.selectedLocale = this.isTranslatable ? this.findSelectedLocale : null;
        }
    }
}
