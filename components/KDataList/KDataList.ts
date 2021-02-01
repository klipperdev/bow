/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {DataListFilterer} from '@klipper/bow/dataList/DataListFilterer';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {FetchRequestDataListEvent} from '@klipper/bow/http/event/FetchRequestDataListEvent';
import {FetchRequestDataListFunction} from '@klipper/bow/http/request/FetchRequestDataListFunction';
import {ObjectMetadata} from '@klipper/bow/metadata/ObjectMetadata';
import {AjaxListContent} from '@klipper/bow/mixins/http/AjaxListContent';
import {provide as RegistrableProvide} from '@klipper/bow/mixins/Registrable';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {deepMerge} from '@klipper/bow/utils/object';
import {replaceRouteQuery, restoreRouteQuery} from '@klipper/bow/utils/router';
import {mergeClassesToString} from '@klipper/bow/utils/style';
import {Canceler} from '@klipper/http-client/Canceler';
import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';
import {FilterCondition} from '@klipper/sdk/models/filters/FilterCondition';
import {FilterResult} from '@klipper/sdk/models/filters/FilterResult';
import {FilterRule} from '@klipper/sdk/models/filters/FilterRule';
import {Sort} from '@klipper/sdk/requests/Sort';
import {mixins} from 'vue-class-component';
import {Component, Prop, Watch} from 'vue-property-decorator';
import {DataOptions} from 'vuetify/types';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    inheritAttrs: false,
})
export default class KDataList extends mixins(
    AjaxListContent,
    SlotWrapper,
    RegistrableProvide('datalist'),
) {
    @Prop({type: Function, required: true})
    public fetchRequest: FetchRequestDataListFunction;

    @Prop({type: Boolean, default: false})
    public wallEmptyMessage: boolean;

    @Prop({type: Boolean, default: false})
    public firstLoader: boolean;

    @Prop({type: Boolean, default: false})
    public disableSort: boolean;

    @Prop({type: Boolean, default: false})
    public disableSearch: boolean;

    @Prop({type: Boolean, default: true})
    public multiSort: boolean;

    @Prop({type: Boolean, default: false})
    public showSelect: boolean;

    @Prop({type: Boolean, default: false})
    public singleSelect: boolean;

    @Prop({type: String, default: 'id'})
    public itemKey: string;

    @Prop({type: [String, Function]})
    public itemClass!: string | Function;

    @Prop({
        type: Array, default() {
            return this.$klipper.itemsPerPage;
        },
    })
    public itemsPerPage: number[];

    @Prop({type: Number})
    public initLimit!: number;

    @Prop({type: String})
    public metadata!: string;

    @Prop({type: Boolean, default: true})
    public topOnRefresh!: boolean;

    @Prop({type: Object, default: null})
    public filters!: FilterRule|FilterCondition|null;

    @Prop({type: Boolean, default: false})
    public routeQuery!: boolean;

    @Prop({type: String})
    public routeQueryPrefix!: string;

    @Prop({type: Boolean, default: false})
    public noResultLarge!: boolean;

    @Prop({type: Boolean, default: false})
    public large!: boolean;

    @Prop({type: Boolean, default: false})
    public extraLarge!: boolean;

    @Prop({type: Boolean, default: false})
    public useSnackbar!: boolean;

    @Prop({type: Array, default: () => []})
    public searchFields!: string[];

    @Prop({type: Boolean, default: false})
    public viewsDetails!: boolean;

    public tableOptions: KDataOptions = {
        page: this.page,
        itemsPerPage: this.limit,
        sortBy: [],
        sortDesc: [],
        groupBy: [],
        groupDesc: [],
        multiSort: true,
        mustSort: false,
        sortable: true,
        searchable: true,
    };

    private filterers: DataListFilterer[] = [];

    public get requestFilters(): FilterResult {
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
    }

    public get requestSort(): Sort[] {
        const sort: Sort[] = [];

        for (const i of Object.keys(this.tableOptions.sortBy)) {
            const column: string = (this.tableOptions.sortBy as any)[i];
            const columnDesc: boolean = (this.tableOptions.sortDesc as any)[i];

            for (const sortPath of this.getSortPaths(column)) {
                sort.push(new Sort(sortPath, columnDesc ? 'desc' : 'asc'));
            }
        }

        return sort;
    }

    private get isMetadataInitialized(): boolean {
        return undefined === this.$store.state.metadata || this.$store.state.metadata.initialized;
    }

    private get isSortable(): boolean {
        return !this.disableSort && this.tableOptions.sortable;
    }

    private get isSearchable(): boolean {
        return !this.disableSearch && this.tableOptions.searchable;
    }

    private get genTableProps(): Dictionary<any> {
        const classes = [] as string[];

        if (this.extraLarge) {
            classes.push('extra-large-rows');
        } else if (this.large) {
            classes.push('large-rows');
        }

        return Object.assign({
            class: mergeClassesToString(this.$attrs.class, classes),
        }, this.$attrs);
    }

    private get genTableListeners(): Dictionary<any> {
        return Object.assign({}, this.$listeners);
    }

    private get genSlotProps(): Dictionary<any> {
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
        };
    }

    public async created(): Promise<void> {
        if (this.firstLoader) {
            this.loading = true;
        }

        if (undefined !== this.initLimit) {
            this.limit = this.initLimit;
        }

        this.tableOptions.searchable = !this.disableSearch;

        if (this.isMetadataInitialized) {
            this.headers = this.$attrs.headers as any || [];
        }
    }

    public async mounted(): Promise<void> {
        this.$root.$on('k-data-list-refresh', async () => {
            await this.refresh();
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
    }

    public destroyed() {
        this.$root.$off('k-data-list-refresh');
        this.$root.$off('k-data-list-search-created');
        this.$root.$off('k-data-list-search-out');
        this.$root.$off('k-data-list-delete-item');
    }

    public register(item: DataListFilterer): void {
        this.filterers.push(item);
    }

    public unregister(item: DataListFilterer): void {
        const found = this.filterers.find((i: DataListFilterer) => i.getId() === item.getId());

        if (found) {
            this.filterers = this.filterers.filter((i: DataListFilterer) => i.getId() !== item.getId());
        }
    }

    public async refreshToFirstPage(): Promise<void> {
        if (this.hasPagination && this.page > 1) {
            this.page = 1;
            this.tableOptions.page = 1;
        } else {
            await this.refresh();
        }
    }

    public async refresh(): Promise<void> {
        await this.fetchData(this.search ? this.search : undefined, this.useSnackbar);
        this.finishLoading();
    }

    public async onUpdatedOptions(options: DataOptions): Promise<void> {
        if (undefined !== options.page && undefined !== options.itemsPerPage) {
            this.page = options.page;
            this.limit = options.itemsPerPage;
            let hasFilters = false;

            for (const filterer of this.filterers) {
                if (null !== filterer.getFilters()) {
                    hasFilters = true;
                    break;
                }
            }

            await this.refresh();
        }
    }

    protected async fetchDataRequest(canceler: Canceler, searchValue?: string): Promise<ListResponse<object>> {
        this.headers = this.$attrs.headers as any || [];
        const sort: Sort[] = this.requestSort;
        const event = new FetchRequestDataListEvent();
        event.page = this.page;
        event.limit = this.limit;
        event.pages = this.pages;
        event.total = this.total;
        event.search = this.isSearchable && searchValue ? searchValue : null;
        event.searchFields = this.searchFields.length > 0 ? this.searchFields : null;
        event.viewsDetails = this.viewsDetails  ? true : null;
        event.canceler = canceler;
        event.filters = this.requestFilters;
        event.sort = sort.length > 0 ? sort : undefined;

        if (this.topOnRefresh) {
            this.$vuetify.goTo(0);
        }

        await this.updateRouteQuery();

        return await this.fetchRequest(event);
    }

    protected hookAfterFetchDataRequest(): void {
        // Disable the default hook after fetch data request
    }

    protected getSortForRouteQuery(): Sort[] {
        const sort: Sort[] = [];

        for (const i of Object.keys(this.tableOptions.sortBy)) {
            const field = (this.tableOptions.sortBy as any)[i];

            for (const sortPath of this.getSortPaths(field)) {
                sort.push(new Sort(sortPath, (this.tableOptions.sortDesc as any)[i] ? 'desc' : 'asc'));
            }
        }

        return sort;
    }

    protected getSortPaths(column: string): string[] {
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
    }

    protected async updateTableOptions(): Promise<void> {
        if (!this.metadata || !this.$metadata) {
            return;
        }

        const meta: ObjectMetadata | undefined = await this.$metadata.get(this.metadata);

        if (!meta) {
            return;
        }

        this.tableOptions.page = this.page;
        this.tableOptions.itemsPerPage = this.limit;
        this.tableOptions.multiSort = meta.multiSortable;
        this.tableOptions.sortable = meta.sortable;
        this.tableOptions.searchable = meta.searchable;

        if (0 === this.tableOptions.sortBy.length) {
            Object.keys(meta.defaultSortable).forEach((key: any) => {
                const sortHeader = this.getHeaderBySortPath(key);

                if (sortHeader && !this.tableOptions.sortBy.includes(sortHeader)) {
                    this.tableOptions.sortBy.push(sortHeader);
                    this.tableOptions.sortDesc.push('asc' !== meta.defaultSortable[key].toLowerCase());
                }
            });
        }

        if (this.firstLoader && this.firstLoading) {
            await this.refresh();
        }
    }

    protected getHeaderBySortPath(sortPath: string): string | null {
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
    }

    protected async updateRouteQuery(): Promise<void> {
        if (!this.routeQuery || !this.metadata || !this.$metadata) {
            return;
        }

        const meta: ObjectMetadata | undefined = await this.$metadata.get(this.metadata);

        if (!meta) {
            return;
        }

        const sort: Sort[] = this.getSortForRouteQuery();
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
            s: sort.length > 0 && defaultSort !== sort.toString() ? sort.toString() : undefined,
        }, this.$route, this.routeQueryPrefix);
    }

    protected async restoreFromRouteQuery(): Promise<void> {
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
    }

    private onToggleAlert(open: boolean): void {
        if (!open) {
            this.previousError = null;
        }
    }

    @Watch('isMetadataInitialized')
    private async watchIsMetadataInitialized(initialized: boolean): Promise<void> {
        if (initialized) {
            this.headers = this.$attrs.headers as any || [];
        }
    }

    @Watch('headers')
    private async watchHeaders(): Promise<void> {
        await this.restoreFromRouteQuery();
        await this.updateTableOptions();

        this.$root.$emit('k-data-list-search-in', this.search);
    }

    @Watch('search')
    private async searchRequest(searchValue?: string): Promise<void> {
        if (!this.isInitialized) {
            return;
        }

        this.$root.$emit('k-data-list-search-in', searchValue);
        this.page = 1;
        this.tableOptions.page = 1;
        await this.fetchData(searchValue);
        this.finishLoading();
    }
}

interface KDataOptions extends DataOptions {
    sortable: boolean;
    searchable: boolean;
}
