/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {FetchRequestDataListEvent} from '@klipper/bow/http/event/FetchRequestDataListEvent';
import {KanbanData} from '@klipper/bow/kanban/KanbanData';
import {AjaxListContent} from '@klipper/bow/mixins/http/AjaxListContent';
import {inject as RegistrableInject} from '@klipper/bow/mixins/Registrable';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {replaceRouteQuery, restoreRouteQuery} from '@klipper/bow/utils/router';
import {Canceler} from '@klipper/http-client/Canceler';
import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';
import {FilterResult} from '@klipper/sdk/models/filters/FilterResult';
import {mergeFilters} from '@klipper/sdk/utils/filter';
import {mixins} from 'vue-class-component';
import {Component, Prop, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    inheritAttrs: false,
})
export default class KDataKanbanColumn extends mixins(
    SlotWrapper,
    AjaxListContent,
    RegistrableInject<'dataKanban', any>('dataKanban'),
) {
    @Prop({type: Object, default: null})
    public filters!: FilterResult;

    @Prop({type: String})
    public routeQueryPrefix!: string;

    @Prop({type: Boolean, default: false})
    public loadingOnInit!: boolean;

    public kanbanData: KanbanData = {
        itemKey: 'id',
        limit: 20,
        searchFields: [],
        disableSearch: false,
        sort: null,
        filters: null,
        viewsDetails: false,
        fetchRequest: null,
        topOnRefresh: true,
        routeQuery: false,
        routeQueryPrefix: null,
    };

    private get genRouteQueryPrefix(): string|undefined {
        let routeQueryPrefix = this.routeQueryPrefix;

        if (this.kanbanData.routeQueryPrefix) {
            routeQueryPrefix = !!routeQueryPrefix
                ? this.kanbanData.routeQueryPrefix + '_' + routeQueryPrefix
                : this.kanbanData.routeQueryPrefix;
        }

        return routeQueryPrefix || undefined;
    }

    public async mounted(): Promise<void> {
        this.loading = this.loadingOnInit;
        await this.restoreFromRouteQuery();
    }

    protected async fetchDataRequest(canceler: Canceler, searchValue?: string): Promise<ListResponse<object>> {
        if (!this.kanbanData.fetchRequest) {
            throw new Error('The fetch request function is required on data kanban component for the data kanban column component');
        }

        this.headers = this.$attrs.headers as any || [];
        const event = new FetchRequestDataListEvent();
        event.page = this.page;
        event.limit = this.limit;
        event.pages = this.pages;
        event.total = this.total;
        event.search = !!searchValue && !this.kanbanData.disableSearch ? searchValue : null;
        event.searchFields = this.kanbanData.searchFields.length > 0 ? this.kanbanData.searchFields : null;
        event.viewsDetails = this.kanbanData.viewsDetails  ? true : null;
        event.canceler = canceler;
        event.filters = mergeFilters('AND', this.kanbanData.filters, this.filters);
        event.sort = this.kanbanData.sort || undefined;

        await this.updateRouteQuery();

        return await this.kanbanData.fetchRequest(event);
    }

    protected async hookBeforeFetchDataRequestList(topOnRefresh: boolean = false): Promise<void> {
        if (this.kanbanData.topOnRefresh || topOnRefresh) {
            ((this.$refs.column as Vue).$refs.content as Element).scrollTop = 0;
        }
    }

    protected getSlotProps(props?: Dictionary<any>): Dictionary<any> {
        return Object.assign({
            refreshToFirstPage: this.refreshToFirstPage,
            refresh: this.refresh,
            total: this.total,
            search: this.search,
        }, props || {});
    }

    protected async restoreFromRouteQuery(): Promise<void> {
        if (!this.kanbanData.routeQuery || !this.genRouteQueryPrefix) {
            return;
        }

        // restore page
        const prevPage = this.page;
        this.page = restoreRouteQuery<number>('p', this.$route, this.genRouteQueryPrefix, this.page, 'number') || -1;
        this.page = this.page >= 1 ? this.page : prevPage;
    }

    protected async updateRouteQuery(): Promise<void> {
        if (!this.kanbanData.routeQuery || !this.genRouteQueryPrefix) {
            return;
        }

        replaceRouteQuery({
            p: this.page > 1 ? this.page.toString() : undefined,
        }, this.$route, this.genRouteQueryPrefix);
    }

    @Watch('kanbanData.limit', {immediate: true})
    private watchDataLimit(limit: number): void {
        this.limit = limit;
    }

    @Watch('search')
    private async searchRequest(searchValue?: string): Promise<void> {
        this.page = 1;
        await this.fetchData(searchValue);
        this.finishLoading();
    }
}
