<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-kanban
        ref="kanban"
        v-bind="$attrs"
        v-on="$listeners"
    >
        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
            <slot :name="slotItem.original" v-bind="getSlotProps(props)"/>
        </template>
    </k-kanban>
</template>

<script lang="ts">
import {DataListFilterer} from '@klipper/bow/dataList/DataListFilterer';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {FetchRequestDataListFunction} from '@klipper/bow/http/request/FetchRequestDataListFunction';
import {KanbanData} from '@klipper/bow/kanban/KanbanData';
import {AjaxListContent} from '@klipper/bow/mixins/http/AjaxListContent';
import {provide as RegistrableProvide} from '@klipper/bow/mixins/Registrable';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {replaceRouteQuery, restoreRouteQuery} from '@klipper/bow/utils/router';
import {FilterCondition} from '@klipper/sdk/models/filters/FilterCondition';
import {FilterResult} from '@klipper/sdk/models/filters/FilterResult';
import {FilterRule} from '@klipper/sdk/models/filters/FilterRule';
import {Sort} from '@klipper/sdk/requests/Sort';
import {mixins} from 'vue-class-component';
import {Component, Prop, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    inheritAttrs: false,
})
export default class KDataKanban extends mixins(
    SlotWrapper,
    RegistrableProvide('dataKanban'),
    RegistrableProvide('datalist', false, 'registerDataList', 'unregisterDataList'),
) {
    @Prop({type: Function, required: true})
    public fetchRequest: FetchRequestDataListFunction;

    @Prop({type: Boolean, default: false})
    public disableSearch: boolean;

    @Prop({type: String, default: 'id'})
    public itemKey: string;

    @Prop({type: Number, default() {
        return this.$klipper.defaultKanbanItemPerPage;
    }})
    public limit!: number;

    @Prop({type: Boolean, default: false})
    public topOnRefresh!: boolean;

    @Prop({type: Array, default: () => []})
    public sort!: Sort|Sort[]|string|string[];

    @Prop({type: Object, default: null})
    public filters!: FilterRule|FilterCondition|null;

    @Prop({type: Boolean, default: false})
    public routeQuery!: boolean;

    @Prop({type: String})
    public routeQueryPrefix!: string;

    @Prop({type: Array, default: () => []})
    public searchFields!: string[];

    @Prop({type: Boolean, default: false})
    public viewsDetails!: boolean;

    @Prop({type: Boolean, default: false})
    public useSnackbar!: boolean;

    public search: string = '';

    private filterers: DataListFilterer[] = [];

    private dataColumns: AjaxListContent[] = [];

    public get total(): number {
        let total = 0;

        this.dataColumns.forEach((column) => {
            total += column.total ?? 0;
        });

        return total;
    }

    public get loading(): boolean {
        let loading = false;

        this.dataColumns.forEach((column) => {
            loading = loading || (column as any).loading;
        });

        return loading;
    }

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

    private get kanbanData(): KanbanData {
        return {
            itemKey: this.itemKey,
            limit: this.limit,
            searchFields: this.searchFields,
            disableSearch: this.disableSearch,
            sort: this.sort || null,
            filters: this.requestFilters,
            viewsDetails: this.viewsDetails,
            fetchRequest: this.fetchRequest,
            topOnRefresh: this.topOnRefresh,
            routeQuery: this.routeQuery,
            routeQueryPrefix: this.routeQueryPrefix || null,
        };
    }

    public register(dataColumn: AjaxListContent): void {
        if (!this.dataColumns.find((i: Vue) => i._uid === dataColumn._uid)) {
            this.dataColumns.push(dataColumn);
            (dataColumn as any).kanbanData = this.kanbanData;
        }
    }

    public unregister(dataColumn: AjaxListContent): void {
        if (this.dataColumns.find((i: Vue) => i._uid === dataColumn._uid)) {
            this.dataColumns = this.dataColumns.filter((i: Vue) => i._uid !== dataColumn._uid);
            (dataColumn as any).kanbanData = {};
        }
    }

    public registerDataList(item: DataListFilterer): void {
        if (!this.filterers.find((i: DataListFilterer) => i.getId() === item.getId())) {
            this.filterers.push(item);
        }
    }

    public unregisterDataList(item: DataListFilterer): void {
        if (this.filterers.find((i: DataListFilterer) => i.getId() === item.getId())) {
            this.filterers = this.filterers.filter((i: DataListFilterer) => i.getId() !== item.getId());
        }
    }

    public async mounted(): Promise<void> {
        this.$root.$on('k-data-kanban-refresh', this.onDataKanbanRefresh);
        this.$root.$on('k-data-kanban-search-created', this.onDataKanbanSearchCreated());
        this.$root.$on('k-data-kanban-search-out', this.onDataKanbanSearchOut);

        this.$root.$emit('k-data-kanban-refresh-search-field');

        await this.restoreFromRouteQuery();
    }

    public destroyed() {
        this.$root.$off('k-data-kanban-refresh', this.onDataKanbanRefresh);
        this.$root.$off('k-data-kanban-search-created', this.onDataKanbanSearchCreated);
        this.$root.$off('k-data-kanban-search-out', this.onDataKanbanSearchOut);
    }

    public async refreshToFirstPage(): Promise<void> {
        await this.$nextTick(async () => {
            const promises: Array<Promise<any>> = [];

            this.dataColumns.forEach((column) => {
                promises.push(column.refreshToFirstPage());
            });

            await Promise.all(promises);
        });
    }

    public async refresh(): Promise<void> {
        await this.$nextTick(async () => {
            const promises: Array<Promise<any>> = [];

            this.dataColumns.forEach((column) => {
                promises.push(column.refresh(this.useSnackbar));
            });

            await Promise.all(promises);
        });
    }

    protected getSlotProps(props?: Dictionary<any>): Dictionary<any> {
        return Object.assign({
            fetchRequest: this.fetchRequest,
            disableSearch: this.disableSearch,
            itemKey: this.itemKey,
            limit: this.limit,
            topOnRefresh: this.topOnRefresh,
            filters: this.filters,
            routeQuery: this.routeQuery,
            routeQueryPrefix: this.routeQueryPrefix,
            searchFields: this.searchFields,
            refreshToFirstPage: this.refreshToFirstPage,
            refresh: this.refresh,
            loading: this.loading,
            total: this.total,
            search: this.search,
        }, props || {});
    }

    protected async updateRouteQuery(): Promise<void> {
        if (!this.routeQuery) {
            return;
        }

        replaceRouteQuery({
            q: this.search ? this.search : undefined,
        }, this.$route, this.routeQueryPrefix);
    }

    protected async restoreFromRouteQuery(): Promise<void> {
        if (!this.routeQuery) {
            return;
        }

        // restore search
        this.search = restoreRouteQuery<string>('q', this.$route, this.routeQueryPrefix, this.search) || '';
        this.$root.$emit('k-data-kanban-search-in', this.search);
    }

    protected onDataKanbanRefresh(): void {
        this.refresh().then();
    }

    protected onDataKanbanSearchCreated(): void {
        this.$root.$emit('k-data-kanban-search-in', this.search);
    }

    protected onDataKanbanSearchOut(): void {
        this.search = null !== searchValue ? searchValue.trim() : '';
    }

    @Watch('search')
    private async searchRequest(searchValue?: string): Promise<void> {
        this.$root.$emit('k-data-kanban-search-in', searchValue);

        this.dataColumns.forEach((column) => {
            column.search = searchValue || '';
        });

        await this.updateRouteQuery();
    }

    @Watch('kanbanData', {immediate: true})
    private watchFetchRequest(kanbanData: KanbanData): void {
        this.dataColumns.forEach((column) => {
            (column as any).kanbanData = kanbanData;
        });
    }
}
</script>
