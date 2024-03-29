<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-loading
        v-if="firstLoader && firstLoading"
        class="mt-5"
    />

    <k-wall-message
        v-else-if="firstLoader && wallEmptyMessage && hasNoItems"
    >
        <template v-for="slotItem in getSlotItems('no-items')" v-slot:[slotItem.target]>
            <slot :name="slotItem.original">
                <k-no-result-message
                    :dense="!noResultLarge"
                    :message="previousError ? errorMessage : undefined"
                    class="mt-n3 mb-n3"
                />
            </slot>
        </template>
    </k-wall-message>

    <div
        v-else
    >
        <slot
            name="prepend"
            v-bind="genSlotProps"
        />

        <slot
            name="list"
            v-bind="genDataListSlotProps"
        >
            <v-card>
                <v-data-table
                    ref="dataTable"
                    v-bind="genTableProps"
                    v-on="genTableListeners"
                    :headers="headers"
                    :items="items"
                    :item-class="itemClass"
                    :loading="loading"
                    :loader-height="2"
                    :disable-sort="!isSortable"
                    :server-items-length="total"
                    :show-select="showSelect"
                    :single-select="singleSelect"
                    :search="search"
                    :options.sync="tableOptions"
                    :item-key="itemKey"
                    :footer-props="{
                        'items-per-page-options': itemsPerPage,
                    }"
                    @update:options="onUpdatedOptions"
                >
                    <template v-slot:body.prepend="{headers}">
                        <tr v-if="previousError">
                            <td :colspan="headers.length">
                                <v-alert
                                    class="mt-1 mb-1"
                                    color="error"
                                    dark
                                    dense
                                    dismissible
                                    @input="onToggleAlert"
                                >
                                    <v-icon
                                        dark
                                        size="26"
                                        class="mr-3 mt-n1"
                                    >
                                        warning
                                    </v-icon>

                                    {{ errorMessage }}
                                </v-alert>
                            </td>
                        </tr>
                    </template>

                    <template v-slot:no-data>
                        <slot name="no-items">
                            <k-no-result-message
                                :dense="!noResultLarge"
                                class="mt-n3 mb-n3"
                            />
                        </slot>
                    </template>

                    <template v-slot:loading>
                        <slot name="loading">
                            <k-loading
                                :size="28"
                                :width="3"
                                class="mt-n3 mb-n3"
                            />
                        </slot>
                    </template>

                    <template v-for="slotItem in getSlotItems('data-table')" v-slot:[slotItem.target]="props">
                        <slot :name="slotItem.original" v-bind="props"/>
                    </template>
                </v-data-table>
            </v-card>
        </slot>

        <slot
            name="append"
            v-bind="genSlotProps"
        />
    </div>
</template>

<style lang="scss" src="./KDataList.scss" />

<script lang="ts">
import {DataListFilterer} from '@klipper/bow/dataList/DataListFilterer';
import {DataListOptions} from '@klipper/bow/dataList/DataListOptions';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {FetchRequestDataListEvent} from '@klipper/bow/http/event/FetchRequestDataListEvent';
import {FetchRequestDataListFunction} from '@klipper/bow/http/request/FetchRequestDataListFunction';
import {ObjectMetadata} from '@klipper/bow/metadata/ObjectMetadata';
import {AjaxListContent} from '@klipper/bow/mixins/http/AjaxListContent';
import {provide as RegistrableProvide} from '@klipper/bow/mixins/Registrable';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
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
    public delayLoading!: boolean;

    @Prop({type: Boolean, default: false})
    public externalLoading: boolean;

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

    @Prop({type: Boolean, default: false})
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

    public tableOptions: DataListOptions = {
        page: this.page,
        itemsPerPage: this.limit,
        sortBy: [],
        sortDesc: [],
        groupBy: [],
        groupDesc: [],
        multiSort: this.multiSort,
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
            resetSelection: this.resetSelection,
        };
    }

    private get genDataListSlotProps(): Dictionary<any> {
        return Object.assign({
            genTableProps: this.genTableProps,
            genTableListeners: this.genTableListeners,
            itemClass: this.itemClass,
            isSortable: this.isSortable,
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
        }, this.genSlotProps);
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
        this.$root.$on('k-data-list-refresh', this.onDataListRefresh);
        this.$root.$on('k-data-list-search-created', this.onDataListSearchCreated);
        this.$root.$on('k-data-list-search-out', this.onDataListSearchOut);
        this.$root.$on('k-data-list-delete-item', this.onDataListDeleteItem);

        this.$root.$emit('k-data-list-refresh-search-field');
    }

    public destroyed(): void {
        this.$root.$off('k-data-list-refresh', this.onDataListRefresh);
        this.$root.$off('k-data-list-search-created', this.onDataListSearchCreated);
        this.$root.$off('k-data-list-search-out', this.onDataListSearchOut);
        this.$root.$off('k-data-list-delete-item', this.onDataListDeleteItem);
    }

    public register(item: DataListFilterer): void {
        if (!this.filterers.find((i: DataListFilterer) => i.getId() === item.getId())) {
            this.filterers.push(item);
        }
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
            await this.refresh(false, true);
        }
    }

    public async refresh(showSnackbar: boolean = false, topOnRefresh: boolean = false): Promise<void> {
        await this.fetchData(this.search ? this.search : undefined, this.useSnackbar || showSnackbar, this.topOnRefresh || topOnRefresh);
        this.finishLoading();
    }

    public async resetSelection(): Promise<void> {
        this.$emit('input', []);
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

            await this.refresh(false, true);
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

        await this.updateRouteQuery();

        return await this.fetchRequest(event);
    }

    protected async hookBeforeFetchDataRequestList(topOnRefresh: boolean = false): Promise<void> {
        if (this.topOnRefresh || topOnRefresh) {
            await this.$vuetify.goTo(0);
        }
    }

    protected hookAfterFetchDataRequest(): void {
        // Disable the default hook after fetch data request
    }

    protected getSortForRouteQuery(forQuery: boolean = false): Sort[] {
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
        this.tableOptions.multiSort = meta.multiSortable && this.multiSort;
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
            await this.refresh(false, true);
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

    protected onDataListRefresh(): void {
        this.refresh().then(() => {});
    }

    protected onDataListSearchOut(searchValue: string|null): void {
        this.search = null !== searchValue ? searchValue.trim() : '';
    }

    protected onDataListSearchCreated(): void {
        this.$root.$emit('k-data-list-search-in', this.search);
    }

    protected onDataListDeleteItem(value: string | number, key: string = 'id'): void {
        this.deleteItem(value, key);
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
        if (!this.delayLoading) {
            await this.restoreFromRouteQuery();
            await this.updateTableOptions();

            this.$root.$emit('k-data-list-search-in', this.search);
        }
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

    @Watch('total')
    private watchTotal(total: number): void {
        this.$emit('changetotal', total);
    }

    @Watch('externalLoading', {immediate: true})
    private watchExternalLoading(externalLoading: boolean): void {
        this.loading = externalLoading;
        this.previousRequests.cancelAll();
    }

    @Watch('delayLoading')
    private async watchDelayLoading(delayLoading: boolean): Promise<void> {
        if (!delayLoading) {
            await this.watchHeaders();
        }
    }
}
</script>
