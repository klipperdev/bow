<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div
        class="k-component-list"
    >
        <slot v-bind="genSlotProps"/>
    </div>
</template>

<script lang="ts">
import {DataListHeaderExcludable} from '@klipper/bow/composables/mixins/dataListHeaderExcludable';
import {AjaxListContent} from '@klipper/bow/composables/mixins/http/ajaxListContent';
import {provide as RegistrableProvide} from '@klipper/bow/composables/mixins/registrable';
import {SlotWrapper} from '@klipper/bow/composables/mixins/slotWrapper';
import {DataListFilterer} from '@klipper/bow/dataList/DataListFilterer';
import {DataListHeader} from '@klipper/bow/dataList/DataListHeader';
import {DataListOptions} from '@klipper/bow/dataList/DataListOptions';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {FetchRequestDataListEvent} from '@klipper/bow/http/event/FetchRequestDataListEvent';
import {FetchRequestDataListFunction} from '@klipper/bow/http/request/FetchRequestDataListFunction';
import {FetchedEventDataList} from '@klipper/bow/dataList/FetchedEventDataList';
import {ObjectMetadata} from '@klipper/bow/metadata/ObjectMetadata';
import {consoleError, consoleWarn} from '@klipper/bow/utils/console';
import {deepMerge} from '@klipper/bow/utils/object';
import {replaceRouteQuery, restoreRouteQuery} from '@klipper/bow/utils/router';
import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';
import {Sort} from '@klipper/sdk/requests/Sort';
import {defineComponent} from '@vue/composition-api';
import {PropType} from 'vue';
import {DataOptions} from 'vuetify/types';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default defineComponent({
    name: 'KComponentList',

    mixins: [
        AjaxListContent,
        DataListHeaderExcludable,
        SlotWrapper,
        RegistrableProvide('dataComponent', true),
        RegistrableProvide('datalist', false, 'registerDataList', 'unregisterDataList'),
    ],

    props: {
        metadata: {
            type: String,
            required: true,
        },

        headers: {
            type: Array as PropType<DataListHeader[]>,
            default: () => [],
        },

        fetchRequest: {
            type: Function as PropType<FetchRequestDataListFunction|undefined>,
            default: undefined,
        },

        itemKey: {
            type: String,
            default: 'id',
        },

        itemClass: {
            type: [String, Function] as PropType<string|Function>,
            default: undefined,
        },

        itemsPerPage: {
            type: Array as PropType<number[]>,
            default() {
                return this.$klipper.itemsPerPage;
            },
        },

        delayLoading: {
            type: Boolean,
            default: false,
        },

        resetOnDelayLoading: {
            type: Boolean,
            default: false,
        },

        externalLoading: {
            type: Boolean,
            default: false,
        },

        defaultSort: {
            type: Array as PropType<string[]>,
            default: () => [],
        },

        disableSort: {
            type: Boolean,
            default: false,
        },

        disableSearch: {
            type: Boolean,
            default: false,
        },

        multiSort: {
            type: Boolean,
            default: false,
        },

        showSelect: {
            type: Boolean,
            default: false,
        },

        singleSelect: {
            type: Boolean,
            default: false,
        },

        initLimit: {
            type: Number,
            default: undefined,
        },

        topOnRefresh: {
            type: Boolean,
            default: false,
        },

        filters: {
            type: Object as PropType<FilterRule|FilterCondition|null>,
            default: null,
        },

        routeQuery: {
            type: Boolean,
            default: false,
        },

        routeQueryPrefix: {
            type: String,
        },

        rootEventPrefix: {
            type: String,
        },

        noResultLarge: {
            type: Boolean,
            default: false,
        },

        useSnackbar: {
            type: Boolean,
            default: false,
        },

        noExport: {
            type: Boolean,
            default: false,
        },

        noImport: {
            type: Boolean,
            default: false,
        },

        exportFields: {
            type: Array as PropType<string[]>,
            default: () => [],
        },

        fields: {
            type: Array as PropType<string[]>,
            default: () => [],
        },

        searchFields: {
            type: Array as PropType<string[]>,
            default: () => [],
        },

        viewsDetails: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        const limit = this.$klipper?.defaultItemPerPage || 20 as number;

        return {
            limit,

            // Allow to avoid to refresh 2 times in the initialization with DataTable component
            updatedOptionsInitialized: false as boolean,

            tableOptions: {
                page: this.page,
                itemsPerPage: limit,
                sortBy: [],
                sortDesc: [],
                groupBy: [],
                groupDesc: [],
                multiSort: this.isMultiSortable,
                mustSort: false,
                sortable: true,
                searchable: true,
            } as DataListOptions,

            filterers: [] as DataListFilterer[],
        };
    },

    computed: {
        requestFilters(): FilterResult {
            let requestFilters = this.filters ? deepMerge({}, this.filters) : null;

            for (const filterer of this.filterers) {
                let filters = filterer.getFilters();

                if (!filters) {
                    continue;
                } else {
                    filters = deepMerge({}, filters);
                }

                if (!requestFilters) {
                    requestFilters = filters;
                } else if ('AND' === (requestFilters as FilterCondition).condition) {
                    (requestFilters as FilterCondition).rules.push(filters);
                } else {
                    requestFilters = {
                        condition: 'AND',
                        rules: [
                            requestFilters,
                            filters,
                        ],
                    } as FilterCondition;
                }
            }

            return requestFilters;
        },

        requestSort(): Sort[] {
            const sort: Sort[] = [];

            for (const i of Object.keys(this.tableOptions.sortBy)) {
                const column: string = (this.tableOptions.sortBy as any)[i];
                const columnDesc: boolean = (this.tableOptions.sortDesc as any)[i];

                for (const sortPath of this.getSortPaths(column)) {
                    sort.push(new Sort(sortPath, columnDesc ? 'desc' : 'asc'));
                }
            }

            if (0 === sort.length && this.defaultSort.length > 0) {
                for (const sortItem of this.defaultSort) {
                    const config = sortItem.split(':');

                    if (2 === config.length) {
                        sort.push(new Sort(config[0], config[1]));
                    }
                }
            }

            return sort;
        },

        isMetadataInitialized(): boolean {
            return undefined === this.$store.state.metadata || this.$store.state.metadata.initialized;
        },

        isSortable(): boolean {
            return !this.disableSort && this.tableOptions.sortable;
        },

        isMultiSortable(): boolean {
            return this.multiSort
                && this.$store.state.metadata.metadatas[this.metadata]
                && this.$store.state.metadata.metadatas[this.metadata].multiSortable
            ;
        },

        isSearchable(): boolean {
            return !this.disableSearch && this.tableOptions.searchable;
        },

        isExportAvailable(): boolean {
            return !!(
                   this.$store.state.metadata.metadatas[this.metadata]
                && this.$store.state.metadata.metadatas[this.metadata].availableActions.includes('export'))
                && !this.noExport
            ;
        },

        isImportAvailable(): boolean {
            return !!(
                   this.$store.state.metadata.metadatas[this.metadata]
                && this.$store.state.metadata.metadatas[this.metadata].availableActions.includes('import'))
                && !this.noImport
            ;
        },

        genTableProps(): Dictionary<any> {
            return Object.assign({
                'headers': this.getFilteredHeaders(this.headers),
                'items': this.items,
                'item-key': this.itemKey,
                'item-class': this.itemClass,
                'items-per-page': this.limit,
                'loading': this.loading,
                'loader-height': 2,
                'disable-sort': !this.isSortable,
                'server-items-length': this.total,
                'show-select': this.showSelect,
                'single-select': this.singleSelect,
                'search': this.search,
                'footer-props': {
                    'items-per-page-options': this.itemsPerPage,
                },
            }, this.$attrs);
        },

        genTableListeners(): Dictionary<any> {
            return Object.assign({
                'update:options': this.onUpdatedOptions,
            }, this.$listeners);
        },

        genQueryBuilderProps(): Dictionary<any> {
            return {
                'metadata': this.metadata,
                'route-query': this.routeQuery,
                'route-query-prefix': this.routeQueryPrefix,
            };
        },

        genQueryBuilderOn(): Dictionary<any> {
            return {
                'change': async () => await this.refreshToFirstPage(),
            };
        },

        genSlotProps(): Dictionary<any> {
            return {
                headers: this.headers,
                items: this.items,
                page: this.page,
                limit: this.limit,
                pages: this.pages,
                total: this.total,
                search: this.search,
                fetching: this.fetching,
                loading: this.loading,
                externalLoading: this.externalLoading,
                refresh: this.refresh,
                refreshToFirstPage: this.refreshToFirstPage,
                resetSelection: this.resetSelection,
                metadata: this.metadata,
                tableAttrs: this.genTableProps,
                tableOn: this.genTableListeners,
                queryBuilderAttrs: this.genQueryBuilderProps,
                queryBuilderOn: this.genQueryBuilderOn,
                itemClass: this.itemClass,
                isSortable: this.isSortable,
                isMultiSortable: this.isMultiSortable,
                requestSort: this.requestSort,
                requestFilters: this.requestFilters,
                showSelect: this.showSelect,
                singleSelect: this.singleSelect,
                tableOptions: this.tableOptions,
                itemKey: this.itemKey,
                itemsPerPage: this.itemsPerPage,
                onUpdatedOptions: this.onUpdatedOptions,
                previousError: this.previousError,
                onToggleAlert: this.onToggleAlert,
                errorCode: this.errorCode,
                errorMessage: this.errorMessage,
                noResultLarge: this.noResultLarge,
                isExportAvailable: this.isExportAvailable,
                isImportAvailable: this.isImportAvailable,
                exportFields: this.exportFields,
                searchFields: this.searchFields,
                topOnRefresh: this.topOnRefresh,
                isInitialized: this.isInitialized,
                hasPagination: this.hasPagination,
                firstLoading: this.firstLoading,
                hasNoItems: this.hasNoItems,
                retryRefresh: this.retryRefresh,
                routeQuery: this.routeQuery,
                routeQueryPrefix: this.routeQueryPrefix,
                rootEventPrefix: this.rootEventPrefix,
                cancel: this.cancel,
                reset: this.reset,
                previousPage: this.previousPage,
                nextPage: this.nextPage,
                addItem: this.addItem,
                deleteItem: this.deleteItem,
                updateItem: this.updateItem,
                fetchData: this.fetchData,
            };
        },

        genFetchedEventDataList(): FetchedEventDataList {
            return {
                items: this.items,
                page: this.page,
                limit: this.limit,
                pages: this.pages,
                total: this.total,
                search: this.isSearchable && this.search ? this.search : null,
                searchFields: this.searchFields,
                viewsDetails: this.viewsDetails,
                filters: this.requestFilters,
                fields: this.fields,
                sort: this.requestSort,
            };
        },
    },

    created(): void {
        this.$root.$on(this.getRootEventPrefix('k-data-list-refresh'), this.onDataListRefresh);
        this.$root.$on(this.getRootEventPrefix('k-data-list-search-created'), this.onDataListSearchCreated);
        this.$root.$on(this.getRootEventPrefix('k-data-list-search-out'), this.onDataListSearchOut);
        this.$root.$on(this.getRootEventPrefix('k-data-list-delete-item'), this.onDataListDeleteItem);

        if (undefined !== this.initLimit) {
            this.limit = this.initLimit;
        }

        this.tableOptions.searchable = !this.disableSearch;
    },

    mounted(): Promise<void> {
        this.$root.$emit(this.getRootEventPrefix('k-data-list-refresh-search-field'));
    },

    destroyed(): void {
        this.$root.$off(this.getRootEventPrefix('k-data-list-refresh'), this.onDataListRefresh);
        this.$root.$off(this.getRootEventPrefix('k-data-list-search-created'), this.onDataListSearchCreated);
        this.$root.$off(this.getRootEventPrefix('k-data-list-search-out'), this.onDataListSearchOut);
        this.$root.$off(this.getRootEventPrefix('k-data-list-delete-item'), this.onDataListDeleteItem);
    },

    methods: {
        registerDataList(item: DataListFilterer): void {
            if (!this.filterers.find((i: DataListFilterer) => i.getId() === item.getId())) {
                this.filterers.push(item);
            }
        },

        unregisterDataList(item: DataListFilterer): void {
            const found = this.filterers.find((i: DataListFilterer) => i.getId() === item.getId());

            if (found) {
                this.filterers = this.filterers.filter((i: DataListFilterer) => i.getId() !== item.getId());
            }
        },

        async refreshToFirstPage(): Promise<void> {
            if (this.hasPagination && this.page > 1) {
                this.page = 1;
                this.tableOptions.page = 1;
            } else {
                await this.refresh(false, true);
            }
        },

        async refresh(showSnackbar: boolean = false, topOnRefresh: boolean = false): Promise<void> {
            await this.fetchData(this.search ? this.search : undefined, this.useSnackbar || showSnackbar, this.topOnRefresh || topOnRefresh);
            this.finishLoading();
        },

        resetSelection(): Promise<void> {
            this.$emit('input', []);
        },

        async onUpdatedOptions(options: DataOptions): Promise<void> {
            if (undefined !== options.page && undefined !== options.itemsPerPage) {
                let hasFilters = false;
                this.page = options.page;

                if (this.pages > -1) {
                    this.limit = options.itemsPerPage;
                    this.tableOptions.sortBy = options.sortBy;
                    this.tableOptions.sortDesc = options.sortDesc;
                }

                for (const filterer of this.filterers) {
                    if (null !== filterer.getFilters()) {
                        hasFilters = true;
                        break;
                    }
                }

                this.$nextTick(() => {
                    this.updatedOptionsInitialized = true;
                    this.refresh(false).then();
                });
            } else {
                this.$nextTick(() => {
                    this.restore();
                });
            }
        },

        async fetchDataRequest(canceler: Canceler, searchValue: string): Promise<ListResponse<Dictionary<any>>> {
            const sort: Sort[] = this.requestSort;
            const event = new FetchRequestDataListEvent();
            event.page = this.page;
            event.limit = this.limit;
            event.pages = this.pages;
            event.total = this.total;
            event.search = this.isSearchable && searchValue ? searchValue : null;
            event.searchFields = this.searchFields.length > 0 ? this.searchFields : null;
            event.viewsDetails = this.viewsDetails ? true : null;
            event.canceler = canceler;
            event.filters = this.requestFilters;
            event.fields = this.fields && this.fields.length > 0 ? this.fields : null;
            event.sort = sort.length > 0 ? sort : undefined;

            await this.updateRouteQuery();

            let fetchRequest = this.fetchRequest;

            if (undefined === fetchRequest) {
                fetchRequest = this.standardFetchRequest;
            }

            return await fetchRequest(event);
        },

        async hookBeforeFetchDataRequestList(topOnRefresh: boolean = false): Promise<void> {
            this.$emit('fetch', this.genFetchedEventDataList);
            this.$emit('refresh', this.genFetchedEventDataList);

            if (this.topOnRefresh || topOnRefresh) {
                await this.$vuetify.goTo(0);
            }
        },

        hookAfterFetchDataRequest(): void {
            // Disable the default hook after fetch data request
            this.$emit('fetched', this.genFetchedEventDataList);
            this.$emit('refreshed', this.genFetchedEventDataList);
        },

        getSortForRouteQuery(forQuery: boolean = false): Sort[] {
            const sort: Sort[] = [];
            const sortPaths: string[] = [];

            for (const i of Object.keys(this.tableOptions.sortBy)) {
                const field = (this.tableOptions.sortBy as any)[i];

                for (const sortPath of this.getSortPaths(field)) {
                    if (!sortPaths.find((existingSorPath) => existingSorPath === sortPath)) {
                        sortPaths.push(sortPath);
                        sort.push(new Sort(forQuery ? field : sortPath, (this.tableOptions.sortDesc as any)[i] ? 'desc' : 'asc'));
                    }
                }
            }

            return sort;
        },

        getSortPaths(column: string): string[] {
            const res = [];

            for (const header of this.headers) {
                if (column === header.value) {
                    if (Array.isArray((header as any).sortPath)) {
                        res.push(...(header as any).sortPath);
                    } else {
                        res.push((header as any).sortPath || column);
                        break;
                    }
                }
            }

            return res;
        },

        getHeaderBySortPath(sortPath: string): string | null {
            for (const config of this.headers) {
                const paths = [];

                if (!!config.value) {
                    paths.push(config.value);
                }

                if (Array.isArray(config.sortPath)) {
                    paths.push(...config.sortPath);
                } else if (typeof config.sortPath === 'string') {
                    paths.push(config.sortPath);
                }

                if (paths.includes(sortPath)) {
                    return config.value || null;
                }
            }

            return null;
        },

        async updateRouteQuery(): Promise<void> {
            if (!this.routeQuery || !this.metadata || !this.$metadata) {
                return;
            }

            const meta: ObjectMetadata | undefined = await this.$metadata.get(this.metadata);

            if (!meta) {
                return;
            }

            const sort: Sort[] = this.getSortForRouteQuery();
            const querySort: Sort[] = this.getSortForRouteQuery(true);
            let defaultSort: string = '';

            // tslint:disable-next-line:forin
            for (const key in meta.defaultSortable) {
                if ('' !== defaultSort) {
                    defaultSort += ',';
                }

                if (meta.defaultSortable.hasOwnProperty(key)) {
                    defaultSort += key + ':' + meta.defaultSortable[key];
                }
            }

            replaceRouteQuery({
                p: this.page > 1 ? this.page.toString() : undefined,
                l: this.initLimit === this.limit || this.$klipper.defaultItemPerPage === this.limit ? undefined : this.limit.toString(),
                q: this.search ? this.search : undefined,
                s: sort.length > 0 && defaultSort !== sort.toString() ? querySort.toString() : undefined,
            }, this.$route, this.routeQueryPrefix);
        },

        restore(): void {
            if (!this.routeQuery) {
                this.search = '';
                this.tableOptions.page = 1;
                this.tableOptions.itemsPerPage = this.limit;
                this.$root.$emit(this.getRootEventPrefix('k-data-list-search-in'), this.search);

                return;
            }

            // restore page
            const prevPage = this.page;
            this.page = restoreRouteQuery<number>('p', this.$route, this.routeQueryPrefix, this.page, 'number') || -1;
            this.page = this.page >= 1 ? this.page : prevPage;
            this.tableOptions.page = this.page;

            // restore limit
            const prevLimit = this.limit;
            this.limit = restoreRouteQuery<number>('l', this.$route, this.routeQueryPrefix, this.limit, 'number') || 0;
            this.limit = this.itemsPerPage.includes(this.limit) ? this.limit : prevLimit;

            // restore search
            this.search = restoreRouteQuery<string>('q', this.$route, this.routeQueryPrefix, this.search) || '';
            this.$root.$emit(this.getRootEventPrefix('k-data-list-search-in'), this.search);

            // restore sort
            const sort: string[] = restoreRouteQuery<string[]>('s', this.$route, this.routeQueryPrefix, [], 'array') || [];

            for (const sortItem of sort) {
                const config = sortItem.split(':');

                if (2 === config.length) {
                    for (const header of this.headers) {
                        if (config[0] === header.sortPath || config[0] === header.value) {
                            this.tableOptions.sortBy.push(header.value);
                            this.tableOptions.sortDesc.push('asc' !== config[1].toLowerCase());
                            break;
                        }
                    }
                }
            }

            this.tableOptions.itemsPerPage = this.limit;

            if (0 === this.tableOptions.sortBy.length) {
                const meta: ObjectMetadata | undefined = this.$store.state?.metadata?.metadatas[this.metadata];

                if (meta) {
                    Object.keys(meta.defaultSortable).forEach((key: any) => {
                        const sortHeader = this.getHeaderBySortPath(key);

                        if (sortHeader && !this.tableOptions.sortBy.includes(sortHeader)) {
                            this.tableOptions.sortBy.push(sortHeader);
                            this.tableOptions.sortDesc.push('asc' !== meta.defaultSortable[key].toLowerCase());
                        }
                    });
                }
            }
        },

        onToggleAlert(open: boolean): void {
            if (!open) {
                this.previousError = null;
            }
        },

        onDataListRefresh(): void {
            this.refresh().then(() => {});
        },

        onDataListSearchOut(searchValue: string|null): void {
            this.search = null !== searchValue ? searchValue.trim() : '';
        },

        onDataListSearchCreated(): void {
            this.$root.$emit(this.getRootEventPrefix('k-data-list-search-in'), this.search);
        },

        onDataListDeleteItem(value: string | number, key: string = 'id'): void {
            this.deleteItem(value, key);
        },

        getRootEventPrefix(eventName: string): string {
            return this.rootEventPrefix + (this.rootEventPrefix ? '-' : '') + eventName;
        },

        async standardFetchRequest(event: FetchRequestDataListEvent): Promise<ListResponse<Dictionary<any>>> {
            const pluralName = this.$store.state?.metadata?.metadatas[this.metadata]?.pluralName;

            if ( !pluralName) {
                consoleWarn('KComponentList component requires metadata attribute to use the default fetch request');

                return {results: [], page: 0, limit: 0, pages: 0, total: 0} as ListResponse<Dictionary<any>>;
            }

            return await this.$api.requestList(event.buildRequestConfig({
                url: '/{organization}/' + pluralName,
            }), event.canceler);
        },
    },

    watch: {
        isMetadataInitialized: {
            handler(initialized: boolean): void {
                if (initialized) {
                    this.headers = this.$attrs.headers as any || [];
                }
            },
        },

        search: {
            async handler(searchValue?: string): Promise<void> {
                if (!this.isInitialized) {
                    return;
                }

                this.$root.$emit(this.getRootEventPrefix('k-data-list-search-in'), searchValue);
                this.page = 1;
                this.tableOptions.page = 1;
                await this.fetchData(searchValue);
                this.finishLoading();
            },
        },

        total: {
            handler(total: number): void {
                this.$emit('changetotal', total);
            }
        },

        externalLoading: {
            immediate: true,
            async handler(externalLoading: boolean): Promise<void> {
                this.loading = externalLoading;
                this.previousRequests.cancelAll();

                if (!externalLoading && this.delayLoading) {
                    this.$nextTick(async () => {
                        this.restore();

                        if (this.updatedOptionsInitialized) {
                            await this.refresh(true);
                        }
                    })
                } else if (this.delayLoading && this.resetOnDelayLoading) {
                    this.reset();
                }
            },
        },

        delayLoading: {
            handler(delayLoading: boolean): void {
                if (!delayLoading) {
                    this.restore();
                }
            },
        },

        rootEventPrefix: {
            handler(): void {
                consoleError('The "root-event-prefix" props cannot be updated');
            },
        },
    },
});
</script>
