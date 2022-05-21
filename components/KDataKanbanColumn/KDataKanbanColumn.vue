<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-kanban-column
        ref="column"
        v-bind="$attrs"
        v-on="$listeners"
    >
        <template v-slot:header-title-append-inner="props">
            <v-chip
                small
                class="ml-2"
            >
                {{ $number(total, 0) }}
            </v-chip>

            <slot
                name="header-title-append-inner"
                v-bind="getSlotProps(props)"
            />
        </template>

        <template v-slot:header-actions-append="props">
            <v-progress-linear
                indeterminate
                rounded
                absolute
                bottom
                class="mb-2"
                :active="loading"
            />

            <slot
                name="header-actions-append"
                v-bind="getSlotProps(props)"
            />
        </template>

        <template v-slot:footer="props">
            <slot
                name="footer"
                v-bind="getSlotProps(props)"
            />

            <v-fade-transition
                mode="out-in"
            >
                <div
                    v-if="hasPagination"
                    class="k-data-kanban-column-pagination pt-1"
                >
                    <v-btn
                        small
                        rounded
                        ripple
                        icon
                        @click="previousPage" :disabled="page <= 1"
                    >
                        <v-icon
                            small
                        >
                            chevron_left
                        </v-icon>
                    </v-btn>

                    <v-fade-transition
                        mode="out-in"
                    >
                        <span
                            :key="page"
                            class="ml-2 text-caption text-secondary"
                        >
                            {{ page }}
                        </span>
                    </v-fade-transition>

                    <span
                        class="ml-2 mr-2 text-caption text-secondary"
                    >
                        /
                    </span>

                    <span
                        class="mr-2 text-caption text-secondary"
                    >
                        {{ pages > 0 ? pages : 1 }}
                    </span>

                    <v-btn
                        small
                        rounded
                        ripple
                        icon
                        @click="nextPage" :disabled="page >= pages"
                    >
                        <v-icon
                            small
                        >
                            chevron_right
                        </v-icon>
                    </v-btn>
                </div>
            </v-fade-transition>
        </template>

        <template v-slot:default="props">
            <slot
                name="default"
                v-bind="getSlotProps(props)"
            >
                <v-data-iterator
                    :items="items"
                    :items-per-page.sync="limit"
                    :page.sync="page"
                    :loading="loading"
                    :search="search"
                    :item-key="kanbanData.itemKey"
                    hide-default-footer
                    disable-pagination
                    disable-filtering
                    disable-sort
                    class="d-flex flex-column flex-shrink-1"
                >
                    <template v-slot:loading>
                        <slot name="items.loading" v-bind="getSlotProps({})">
                            <k-kanban-card>
                                <k-loading/>
                            </k-kanban-card>
                        </slot>
                    </template>

                    <template v-slot:no-data>
                        <slot name="items.no-results" v-bind="getSlotProps({})">
                            <k-kanban-card>
                                <v-card-text class="text-align-center py-6">
                                    {{ $t('no-result') }}
                                </v-card-text>
                            </k-kanban-card>
                        </slot>
                    </template>

                    <template v-slot:no-results>
                        <slot name="items.no-results" v-bind="getSlotProps({})">
                            <k-kanban-card>
                                <v-card-text class="text-align-center py-6">
                                    {{ $t('no-result') }}
                                </v-card-text>
                            </k-kanban-card>
                        </slot>
                    </template>

                    <template v-slot:item="props">
                        <slot name="items.item" v-bind="getSlotProps(props)"/>
                    </template>

                    <template v-slot:header="props">
                        <slot name="items.header" v-bind="getSlotProps(props)"/>
                    </template>

                    <template v-slot:footer="props">
                        <slot name="items.footer" v-bind="getSlotProps(props)"/>
                    </template>

                    <template v-slot:footer.page-text="props">
                        <slot name="items.footer.page-text" v-bind="getSlotProps(props)"/>
                    </template>

                    <template v-slot:default="props">
                        <slot name="items" v-bind="getSlotProps(props)">
                            <slot
                                v-for="item in items"
                                name="item"
                                v-bind="getSlotProps({item})"
                            />
                        </slot>
                    </template>
                </v-data-iterator>
            </slot>
        </template>

        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
            <slot :name="slotItem.original" v-bind="getSlotProps(props)"/>
        </template>
    </k-kanban-column>
</template>

<style lang="scss" src="./KDataKanbanColumn.scss" />

<script lang="ts">
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
</script>
