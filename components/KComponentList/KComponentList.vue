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
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {FetchRequestDataListEvent} from '@klipper/bow/http/event/FetchRequestDataListEvent';
import {FetchRequestDataListFunction} from '@klipper/bow/http/request/FetchRequestDataListFunction';
import {ObjectMetadata} from '@klipper/bow/metadata/ObjectMetadata';
import {consoleWarn} from '@klipper/bow/utils/console';
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
        RegistrableProvide('datalist'),
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
            } as KDataOptions,

            filterers: [] as DataListFilterer[],
        };
    },

    computed: {
        requestFilters(): FilterResult {
            let requestFilters = this.filters;

            for (const filterer of this.filterers) {
                const filters = filterer.getFilters();

                if (!filters) {
                    continue;
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
                loading: this.loading,
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
                errorMessage: this.errorMessage,
                noResultLarge: this.noResultLarge,
                isExportAvailable: this.isExportAvailable,
                isImportAvailable: this.isImportAvailable,
                exportFields: this.exportFields,
                searchFields: this.searchFields,
                topOnRefresh: this.topOnRefresh,
            };
        },
    },

    created(): void {
        if (undefined !== this.initLimit) {
            this.limit = this.initLimit;
        }

        this.tableOptions.searchable = !this.disableSearch;
    },

    mounted(): Promise<void> {
        this.$root.$on('k-data-list-refresh', async () => {
            this.refresh().then(() => {});
        });

        this.$root.$on('k-data-list-search-out', async (searchValue: string | null) => {
            this.search = null !== searchValue ? searchValue.trim() : '';
        });

        this.$root.$on('k-data-list-delete-item', async (value: string | number, key: string = 'id') => {
            this.deleteItem(value, key);
        });

        this.$root.$on('k-data-list-search-created', async () => {
            this.$root.$emit('k-data-list-search-in', this.search);
        });

        this.$root.$emit('k-data-list-refresh-search-field');
    },

    destroyed(): void {
        this.$root.$off('k-data-list-refresh');
        this.$root.$off('k-data-list-search-created');
        this.$root.$off('k-data-list-search-out');
        this.$root.$off('k-data-list-delete-item');
    },

    methods: {
        register(item: DataListFilterer): void {
            if (!this.filterers.find((i: DataListFilterer) => i.getId() === item.getId())) {
                this.filterers.push(item);
            }
        },

        unregister(item: DataListFilterer): void {
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

                await this.refresh(false, true);
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
            if (this.topOnRefresh || topOnRefresh) {
                await this.$vuetify.goTo(0);
            }
        },

        hookAfterFetchDataRequest(): void {
            // Disable the default hook after fetch data request
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

        restoreFromRouteQuery(): void {
            if (!this.routeQuery) {
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
            this.$root.$emit('k-data-list-search-in', this.search);

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

        async standardFetchRequest(event: FetchRequestDataListEvent): Promise<ListResponse<Dictionary<any>>> {
            const pluralName = this.$store.state?.metadata?.metadatas[this.metadata]?.pluralName;

            if ( !pluralName) {
                consoleWarn('KComponentList component requires metadata attribute to use the default fetch request');

                return {results: [], page: 0, limit: 0, pages: 0, total: 0} as ListResponse<Dictionary<any>>;
            }

            return await this.$api.requestList({
                method: 'GET',
                url: '/{organization}/' + pluralName,
                limit: event.limit,
                page: event.page,
                search: event.search || undefined,
                searchFields: event.searchFields || undefined,
                sort: event.sort,
                filter: event.filters || undefined,
                fields: event.fields || undefined,
                viewsDetails: event.viewsDetails || undefined,
            }, event.canceler);
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

        headers: {
            immediate: true,
            handler(): void {
                if (!this.delayLoading) {
                    this.restoreFromRouteQuery();

                    this.$root.$emit('k-data-list-search-in', this.search);
                }
            },
        },

        search: {
            async handler(searchValue?: string): Promise<void> {
                if (!this.isInitialized) {
                    return;
                }

                this.$root.$emit('k-data-list-search-in', searchValue);
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

                if (!externalLoading && this.delayLoading && !this.isInitialized) {
                    this.restoreFromRouteQuery();

                    this.$root.$emit('k-data-list-search-in', this.search);
                }
            },
        },

        delayLoading: {
            handler(delayLoading: boolean): void {
                if (!delayLoading) {
                    this.restoreFromRouteQuery();

                    this.$root.$emit('k-data-list-search-in', this.search);
                }
            },
        },
    },
});

interface KDataOptions extends DataOptions {
    sortable: boolean;
    searchable: boolean;
}
</script>
