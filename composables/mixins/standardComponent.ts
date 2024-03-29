/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {OnlineCheckable} from '@klipper/bow/composables/mixins/onlineCheckable';
import {StandardComponentForm} from '@klipper/bow/composables/mixins/standardComponentForm';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {StandardDeleteRequestDataEvent} from '@klipper/bow/http/event/StandardDeleteRequestDataEvent';
import {StandardFetchRequestDataEvent} from '@klipper/bow/http/event/StandardFetchRequestDataEvent';
import {StandardPushRequestDataEvent} from '@klipper/bow/http/event/StandardPushRequestDataEvent';
import {StandardDeleteRequestDataFunction} from '@klipper/bow/http/request/StandardDeleteRequestDataFunction';
import {StandardFetchRequestDataFunction} from '@klipper/bow/http/request/StandardFetchRequestDataFunction';
import {StandardPushRequestDataFunction} from '@klipper/bow/http/request/StandardPushRequestDataFunction';
import {createStandardViewData, StandardViewData} from '@klipper/bow/standardView/StandardViewData';
import {StandardViewItem} from '@klipper/bow/standardView/StandardViewItem';
import {consoleWarn} from '@klipper/bow/utils/console';
import {redirectIfExist, replaceRouteQuery} from '@klipper/bow/utils/router';
import {Canceler} from '@klipper/http-client/Canceler';
import Vue, {PropType} from 'vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
interface Props {
    create: boolean;
    value: Dictionary<any>|null;
    defaultValues?: (data: Dictionary<any>) => void;
    fetchRequest?: StandardFetchRequestDataFunction;
    pushRequest?: StandardPushRequestDataFunction|false;
    deleteRequest?: StandardDeleteRequestDataFunction|false;
    externalLoading: boolean;
    externalEditMode: boolean;
    scrollTopAfterPush: boolean;
    closeEditAfterPush: boolean;
    closeEditWithRouterBack: boolean;
    autoRetryRefresh: boolean;
    disableAutoRedirect: boolean;
    fields: string[];
    viewsDetails: boolean;
    quickEditLoading: boolean;
}

interface Data {
    retryRefresh: boolean;
}

interface Computed {
    get refreshOnCreated(): boolean;
    get genStandardData(): StandardViewData;
    get genSlotProps(): Dictionary<any>;
    get hasPushAction(): boolean;
    get hasDeleteAction(): boolean;
    get fetchLoading(): boolean;
    get formRef(): Vue|undefined;
}

interface Methods {
    refresh(showLoading: boolean): Promise<void>;
    push(showLoading: boolean): Promise<void>;
    deleteItem(id: string|number, canceler: Canceler, locale?: string): Promise<string|number|undefined>;
    setData(data: Dictionary<any>|null): void;
    onLocaleChange(locale: string, newLocale?: boolean): Promise<void>;
    onLocaleDelete(locale: string): Promise<void>;
    onGlobalKeyDown(event: KeyboardEvent): void;
    onKeyDown(event: KeyboardEvent): void;
    onDeletedItem(id: string|number): Promise<void>;
    updateErrorExcludedFields(): void;
    init(): Promise<void>;
    standardFetchRequest(event: StandardFetchRequestDataEvent): Promise<object|null>;
    standardPushRequest<D = Dictionary<any>, T = Dictionary<any>>(event: StandardPushRequestDataEvent<D, T>): Promise<Dictionary<any>|null>;
    standardDeleteRequest(event: StandardDeleteRequestDataEvent): Promise<void>;
}

export const StandardComponent = Vue.extend<Data, Methods, Computed, Props>({
    name: 'standardComponent',

    mixins: [
        StandardComponentForm,
        OnlineCheckable,
    ],

    props: {
        create: {
            type: Boolean,
            default: false,
        },

        value: {
            type: Object as PropType<Dictionary<any>|null>,
            default: null,
        },

        defaultValues: {
            type: Function as PropType<(data: Dictionary<any>) => void|undefined>,
            default: undefined,
        },

        fetchRequest: {
            type: Function as PropType<StandardFetchRequestDataFunction|undefined>,
            default: undefined,
        },

        pushRequest: {
            type: [Function, Boolean] as PropType<StandardPushRequestDataFunction|false|undefined>,
            default: undefined,
        },

        deleteRequest: {
            type: [Function, Boolean] as PropType<StandardDeleteRequestDataFunction|false|undefined>,
            default: undefined,
        },

        externalLoading: {
            type: Boolean,
            default: false,
        },

        externalEditMode: {
            type: Boolean,
            default: false,
        },

        scrollTopAfterPush: {
            type: Boolean,
            default: false,
        },

        closeEditAfterPush: {
            type: Boolean,
            default: false,
        },

        closeEditWithRouterBack: {
            type: Boolean,
            default: false,
        },

        /**
         * Automatically retry the refresh request when the network is restored.
         */
        autoRetryRefresh: {
            type: Boolean,
            default: true,
        },

        /**
         * Disable the auto redirect after creation or deletion if redirect query parameter is defined in url.
         */
        disableAutoRedirect: {
            type: Boolean,
            default: false,
        },

        fields: {
            type: Array as PropType<string[]>,
            default: () => [],
        },

        viewsDetails: {
            type: Boolean,
            default: false,
        },

        quickEditLoading: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            retryRefresh: false,
            showLoading: false,
            isMounted: false, // Use for formRef computed
        };
    },

    computed: {
        refreshOnCreated(): boolean {
            return this.create;
        },

        genStandardData(): StandardViewData {
            return createStandardViewData({
                metadata: this.metadataName || null,
                currentLocale: this.currentLocale,
                editMode: this.editMode,
                vertical: this.isVertical,
                dense: this.isDense,
                fetching: this.fetching,
                loading: this.loading,
                showLoading: this.showLoading,
                isCreate: this.isCreate,
                id: this.id || null,
                data: this.data,
                error: this.previousError,
                pushAction: this.push,
                setQuickEdit: this.setQuickEdit,
                quickEditLoading: this.quickEditLoading,
            });
        },

        genSlotProps(): any {
            return {
                id: this.id,
                data: this.data,
                dataReactive: this.dataReactive,
                dataAvailableLocales: this.dataAvailableLocales,
                isCreate: this.isCreate,
                isTranslatable: this.isTranslatable,
                currentLocale: this.currentLocale,
                selectedLocale: this.selectedLocale,
                newLocale: this.newLocale,
                findSelectedLocale: this.findSelectedLocale,
                onLocaleChange: this.onLocaleChange,
                onLocaleDelete: this.onLocaleDelete,
                $form: this.formRef,
                editMode: this.editMode,
                vertical: this.isVertical,
                dense: this.isDense,
                setQuickEdit: this.setQuickEdit,
                toggleQuickEdit: this.toggleQuickEdit,
                enableQuickEdit: this.enableQuickEdit,
                cancelQuickEdit: this.cancelQuickEdit,
                toggleEdit: this.toggleEdit,
                enableEdit: this.enableEdit,
                cancelEdit: this.cancelEdit,
                fetching: this.fetching,
                loading: this.loading,
                showLoading: this.showLoading,
                fetchLoading: this.fetchLoading,
                pushLoading: this.pushLoading,
                error: this.previousError,
                errorCode: this.errorCode,
                errorMessage: this.errorMessage,
                errorExcludedFields: this.errorExcludedFields,
                fieldErrors: this.fieldErrors,
                refresh: this.refresh,
                push: this.push,
                deleteItem: this.deleteItem,
                setData: this.setData,
                onDeletedItem: this.onDeletedItem,
                metadataName: this.metadata,
                objectMetadata: this.objectMetadata,
                isValidForm: this.isValidForm,
                transformModelData: this.transformModelData,
            };
        },

        hasPushAction(): boolean {
            return !!this.pushRequest;
        },

        hasDeleteAction(): boolean {
            return !!this.deleteRequest;
        },

        fetchLoading(): boolean {
            return this.loading && !this.editMode;
        },

        formRef(): Vue|undefined {
            return this.isMounted ? this.$refs['form'] : undefined;
        }
    },

    async created(): Promise<void> {
        if (this.refreshOnCreated) {
            this.refresh().then(() => {});
        }
    },

    async mounted(): Promise<void> {
        window.addEventListener('keyup', this.onGlobalKeyDown);
        this.selectedLocale = this.findSelectedLocale;
        this.backupData = null;

        if (!this.editMode || this.externalEditMode) {
            this.data = typeof this.value === 'object' ? this.value : null;
        }

        this.isMounted = true;
    },

    async destroyed(): Promise<void> {
        window.removeEventListener('keyup', this.onGlobalKeyDown);
        this.cancelQuickEdit();
        this.cancelEdit();
    },

    methods: {
        async refresh(showLoading: boolean = true): Promise<void> {
            const id = this.id;
            let fetchRequest = this.fetchRequest;
            this.retryRefresh = false;

            if (!!this.metadata && !this.objectMetadata) {
                this.retryRefresh = true;

                return;
            }

            if (undefined === fetchRequest) {
                fetchRequest = this.standardFetchRequest;
            }

            if (!!fetchRequest && !this.loading && !this.isCreate) {
                this.showLoading = showLoading;

                const data = await this.fetchData(async (canceler: Canceler) => {
                    const event = new StandardFetchRequestDataEvent();
                    event.id = id;
                    event.canceler = canceler;
                    event.locale = this.selectedLocale || undefined;
                    event.currentLocale = this.currentLocale;
                    event.objectMetadata = this.objectMetadata;
                    event.fields = this.fields && this.fields.length > 0 ? this.fields : null;
                    event.viewsDetails = this.viewsDetails ? true : null;

                    return !fetchRequest ? null : await fetchRequest(event);
                }, false, showLoading);

                if (!this.previousError) {
                    this.data = data;
                }

                if (!data && this.previousError && this.autoRetryRefresh) {
                    this.retryRefresh = true;
                }
            } else if (!id || this.isCreate) {
                this.data = {};

                if (typeof this.defaultValues === 'function') {
                    this.defaultValues(this.data);
                }

                this.injectRouteQueryData();
                this.enableEdit();
            }

            this.loading = false;
            this.showLoading = false;

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

            if (!this.retryRefresh) {
                this.$emit('refreshed', this.data);
            }
        },

        async push(showLoading: boolean = true, onlyFields: string[] = []): Promise<void> {
            let pushRequest = this.pushRequest;

            if (undefined === pushRequest && !!this.objectMetadata) {
                pushRequest = this.standardPushRequest;
            }

            if (pushRequest && !this.loading) {
                if (this.isValidForm()) {
                    const locale = this.newLocale || this.selectedLocale;

                    this.updateErrorExcludedFields();

                    this.showLoading = showLoading;

                    const res = await this.fetchData(async (canceler: Canceler) => {
                        const event = new StandardPushRequestDataEvent();
                        event.id = this.id;
                        event.data = this.data as Dictionary<any>;
                        event.canceler = canceler;
                        event.locale = null !== locale && (!!this.newLocale || locale !== this.$store.state.i18n.locale)
                            ? locale
                            : undefined;
                        event.currentLocale = this.currentLocale;
                        event.objectMetadata = this.objectMetadata;
                        event.dataTransformed = await this.getTransformModelData();

                        if (onlyFields && onlyFields.length > 0) {
                            const fieldIdentifier = this.objectMetadata?.fieldIdentifier || 'id';

                            Object.keys(event.dataTransformed).forEach((key: string) => {
                                if (key !== fieldIdentifier && !onlyFields.includes(key)) {
                                    delete event.dataTransformed[key];
                                }
                            });
                        }

                        return !pushRequest ? null : await pushRequest(event);
                    }, false, showLoading);

                    if (res) {
                        if (this.isCreate) {
                            if (this.disableAutoRedirect || !await redirectIfExist(this.$router)) {
                                this.$emit('created', res);
                                this.$emit('upserted', res);

                                if (this.closeEditAfterPush) {
                                    this.cancelQuickEdit();
                                    this.cancelEdit(this.closeEditWithRouterBack);
                                }

                                if (this.scrollTopAfterPush) {
                                    window.scrollTo(0, 0);
                                }
                            }

                            return;
                        }

                        this.data = res;
                        this.backupData = res;
                        this.cancelQuickEdit();
                        this.cancelEdit();

                        this.selectedLocale = locale;

                        replaceRouteQuery({
                            lang: this.selectedLocale !== this.$store.state.i18n.locale ? this.selectedLocale : undefined,
                        }, this.$route);

                        this.$emit('updated', res);
                        this.$emit('upserted', res);
                        this.$emit('input', res);

                        if (this.closeEditAfterPush) {
                            this.cancelQuickEdit();
                            this.cancelEdit(this.closeEditWithRouterBack);
                        }

                        if (this.scrollTopAfterPush) {
                            window.scrollTo(0, 0);
                        }
                    }
                }
            } else {
                this.cancelQuickEdit();
                this.cancelEdit();
            }

            this.loading = false;
            this.showLoading = false;
        },

        async deleteItem(id: string|number, canceler: Canceler, locale?: string): Promise<string|number|undefined> {
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
        },

        setData(data: Dictionary<any>|null): void {
            this.data = data;
            this.$emit('input', data);
        },

        async onLocaleChange(locale: string, newLocale?: boolean): Promise<void> {
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
        },

        async onLocaleDelete(locale: string): Promise<void> {
            if ((this.hasDeleteAction || !!this.objectMetadata) && undefined !== this.id) {
                const res = await this.fetchData(async (canceler: Canceler) => {
                    await this.deleteItem(this.id as string|number, canceler, locale);

                    return true;
                }, true);

                if (res) {
                    await this.refresh();
                }
            }
        },

        onGlobalKeyDown(event: KeyboardEvent): void {
            // Override this method to react when the keyboard event is dispatched
        },

        onKeyDown(event: KeyboardEvent): void {
            if (event.code === 'Escape' && this.editMode && !this.externalEditMode) {
                this.cancelEdit();
            }
        },

        async onDeletedItem(id: string|number): Promise<void> {
            if (this.disableAutoRedirect || !await redirectIfExist(this.$router)) {
                this.$emit('deleted', id);
            }
        },

        updateErrorExcludedFields(): void {
            const fields: string[] = [];

            if (this.formRef && this.formRef.inputs) {
                this.formRef.inputs.forEach((node: Vue) => {
                    if (node.$attrs.name) {
                        fields.push(node.$attrs.name);
                    }
                });
            }

            this.errorExcludedFields = fields;
        },

        async init(): Promise<void> {
            if (this.retryRefresh) {
                await this.refresh();
            }
        },

        /**
         * @protected
         */
        async standardFetchRequest(event: StandardFetchRequestDataEvent): Promise<object|null> {
            if (!event.objectMetadata || !event.objectMetadata.pluralName) {
                consoleWarn('Standard View component requires metadata attribute to use the default fetch request');

                return null;
            }

            return await this.$api.request(event.buildRequestConfig({
                url: '/{organization}/' + event.objectMetadata.pluralName + '/' + event.id,
            }), event.canceler);
        },

        /**
         * @protected
         */
        async standardPushRequest<D = Dictionary<any>, T = Dictionary<any>>(event: StandardPushRequestDataEvent<D, T>): Promise<Dictionary<any>|null> {
            if (!event.objectMetadata || !event.objectMetadata.pluralName) {
                consoleWarn('Standard View component requires metadata attribute to use the default push request');

                return null;
            }

            return await this.$api.request(event.buildRequestConfig({
                url: event.getPushUrl('/{organization}/' + event.objectMetadata.pluralName),
            }), event.canceler);
        },

        /**
         * @protected
         */
        async standardDeleteRequest(event: StandardDeleteRequestDataEvent): Promise<void> {
            if (!event.objectMetadata || !event.objectMetadata.pluralName) {
                consoleWarn('Standard View component requires metadata attribute to use the default delete request');

                return;
            }

            await this.$api.request(event.buildRequestConfig({
                url: '/{organization}/' + event.objectMetadata.pluralName + '/' + event.id,
            }), event.canceler);
        },
    },

    watch: {
        online: {
            handler(online: boolean): void {
                if (online && this.autoRetryRefresh && this.retryRefresh && !this.loading) {
                    this.refresh().then();
                }
            },
        },

        value: {
            immediate: true,
            handler(value: Dictionary<any>|null): void {
                this.data = value;
            },
        },

        data: {
            immediate: true,
            handler(data: Dictionary<any>|null): void {
                this.$emit('input-data', data);
            }
        },

        loading: {
            handler(loading: boolean): void {
                this.$emit('loading', loading);
            },
        },

        showLoading: 'updateStandardData',

        externalLoading: {
            immediate: true,
            handler(externalLoading: boolean): void {
                this.loading = externalLoading;
                this.previousRequests.cancelAll();
            },
        },

        externalEditMode: {
            immediate: true,
            handler(editMode: boolean): void {
                if (editMode) {
                    this.enableEdit();
                } else {
                    this.cancelEdit();
                }
            },
        },
    },
});
