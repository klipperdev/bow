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
import {consoleWarn} from '@klipper/bow/utils/console';
import {redirectIfExist, replaceRouteQuery} from '@klipper/bow/utils/router';
import {Canceler} from '@klipper/http-client/Canceler';
import Vue, {PropType} from 'vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
interface Props {
    value: Dictionary<any>|null;
    defaultValues?: (data: Dictionary<any>) => void;
    fetchRequest?: StandardFetchRequestDataFunction;
    pushRequest?: StandardPushRequestDataFunction|false;
    deleteRequest?: StandardDeleteRequestDataFunction|false;
    externalLoading: boolean;
    externalEditMode: boolean;
    scrollTopAfterPush: boolean;
    autoRetryRefresh: boolean;
}

interface Data {
    retryRefresh: boolean;
}

interface Computed {
    get refreshOnCreated(): boolean;
    get genSlotProps(): Dictionary<any>;
    get hasPushAction(): boolean;
    get hasDeleteAction(): boolean;
    get fetchLoading(): boolean;
}

interface Methods {
    refresh(showLoading: boolean): Promise<void>;
    push(): Promise<void>;
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

        /**
         * Automatically retry the refresh request when the network is restored.
         */
        autoRetryRefresh: {
            type: Boolean,
            default: true,
        },
    },

    data() {
        return {
            retryRefresh: false,
        };
    },

    computed: {
        refreshOnCreated(): boolean {
            return false;
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
                $form: this.formRef,
                editMode: this.editMode,
                vertical: this.isVertical,
                dense: this.isDense,
                toggleEdit: this.toggleEdit,
                enableEdit: this.enableEdit,
                cancelEdit: this.cancelEdit,
                loading: this.loading,
                fetchLoading: this.fetchLoading,
                pushLoading: this.pushLoading,
                error: this.previousError,
                errorCode: this.errorCode,
                errorMessage: this.errorMessage,
                fieldErrors: this.fieldErrors,
                refresh: this.refresh,
                push: this.push,
                deleteItem: this.deleteItem,
                setData: this.setData,
                onDeletedItem: this.onDeletedItem,
                metadataName: this.metadata,
                objectMetadata: this.objectMetadata,
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
    },

    async destroyed(): Promise<void> {
        window.removeEventListener('keyup', this.onGlobalKeyDown);
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
                const data = await this.fetchData(async (canceler: Canceler) => {
                    const event = new StandardFetchRequestDataEvent();
                    event.id = id;
                    event.canceler = canceler;
                    event.locale = this.selectedLocale || undefined;
                    event.currentLocale = this.currentLocale;
                    event.objectMetadata = this.objectMetadata;

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
        },

        async push(): Promise<void> {
            let pushRequest = this.pushRequest;

            if (undefined === pushRequest && !!this.objectMetadata) {
                pushRequest = this.standardPushRequest;
            }

            if (pushRequest && !this.loading) {
                if (this.isValidForm()) {
                    const locale = this.newLocale || this.selectedLocale;

                    this.updateErrorExcludedFields();

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

                        return !pushRequest ? null : await pushRequest(event);
                    }, false);

                    if (res) {
                        if (this.isCreate) {
                            if (!await redirectIfExist(this.$router)) {
                                this.$emit('created', res);
                                this.$emit('upserted', res);

                                if (this.scrollTopAfterPush) {
                                    window.scrollTo(0, 0);
                                }
                            }

                            return;
                        }

                        this.data = res;
                        this.backupData = res;
                        this.cancelEdit();

                        this.selectedLocale = locale;

                        replaceRouteQuery({
                            lang: this.selectedLocale !== this.$store.state.i18n.locale ? this.selectedLocale : undefined,
                        }, this.$route);

                        this.$emit('updated', res);
                        this.$emit('upserted', res);
                        this.$emit('input', res);

                        if (this.scrollTopAfterPush) {
                            window.scrollTo(0, 0);
                        }
                    }
                }
            } else {
                this.cancelEdit();
            }

            this.loading = false;
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
            if (!await redirectIfExist(this.$router)) {
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

            return await this.$api.request({
                method: 'GET',
                url: '/{organization}/' + event.objectMetadata.pluralName + '/' + event.id,
                params: event.getRequestParams(),
            }, event.canceler);
        },

        /**
         * @protected
         */
        async standardPushRequest<D = Dictionary<any>, T = Dictionary<any>>(event: StandardPushRequestDataEvent<D, T>): Promise<Dictionary<any>|null> {
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
        },

        /**
         * @protected
         */
        async standardDeleteRequest(event: StandardDeleteRequestDataEvent): Promise<void> {
            if (!event.objectMetadata || !event.objectMetadata.pluralName) {
                consoleWarn('Standard View component requires metadata attribute to use the default delete request');

                return;
            }

            await this.$api.request({
                url: '/{organization}/' + event.objectMetadata.pluralName + '/' + event.id,
                method: 'DELETE',
                params: event.getRequestParams(),
            }, event.canceler);
        },
    },

    watch: {
        online: {
            async handler(online: boolean): Promise<void> {
                if (online && this.autoRetryRefresh && this.retryRefresh && !this.loading) {
                    await this.refresh();
                }
            },
        },

        value: {
            immediate: true,
            handler(value: Dictionary<any>|null): void {
                this.data = value;
            },
        },

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
