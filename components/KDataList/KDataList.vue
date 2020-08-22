<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-fade-transition mode="out-in">
        <k-loading v-if="!disableFirstLoading && firstLoading" class="mt-5"></k-loading>

        <k-wall-message v-else-if="!disableFirstLoading && wallEmptyMessage && hasNoItems">
            <template v-for="(slotItem) in getSlotItems('no-items')" v-slot:[slotItem.target]>
                <slot :name="slotItem.original"></slot>
            </template>
        </k-wall-message>

        <div v-else>
            <v-row class="ma-0" align="center">
                <v-col cols="6" md="8" lg="10" class="ma-0 pa-0">
                    <slot name="header"
                          :headers="headers"
                          :items="items"
                          :page="page"
                          :limit="limit"
                          :pages="pages"
                          :total="total"
                          :search="search"
                    ></slot>
                </v-col>
                <v-col cols="6" md="4" lg="2" class="k-data-list__actions">
                    <slot name="header-actions"
                          :headers="headers"
                          :items="items"
                          :page="page"
                          :limit="limit"
                          :pages="pages"
                          :total="total"
                          :search="search"
                    ></slot>

                    <v-btn :color="$color('primary', 'primary lighten-2')"
                           depressed
                           ripple
                           rounded
                           small
                           :loading="loading"
                           @click="refresh"
                    >
                        <v-icon small>refresh</v-icon>
                    </v-btn>
                </v-col>
            </v-row>

            <v-card flat>
                <v-data-table
                        :headers="headers"
                        :items="items"
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
                    <template v-slot:no-data>
                        <slot name="no-items"></slot>
                    </template>

                    <template v-for="(slotItem) in getSlotItems('data-table')"
                              v-slot:[slotItem.target]="{
                                expand,
                                group,
                                groupBy,
                                groupedItems,
                                header,
                                headers,
                                index,
                                isExpanded,
                                isMobile,
                                isOpen,
                                isSelected,
                                item,
                                items,
                                itemsLength,
                                on,
                                options,
                                pageStart,
                                pageStop,
                                pagination,
                                props,
                                remove,
                                select,
                                sort,
                                toggle,
                                updateOptions,
                                value,
                                widths,
                              }"
                    >
                        <slot :name="slotItem.original"
                              :expand="expand"
                              :group="group"
                              :groupBy="groupBy"
                              :groupedItems="groupedItems"
                              :header="header"
                              :headers="headers"
                              :index="index"
                              :isExpanded="isExpanded"
                              :isMobile="isMobile"
                              :isOpen="isOpen"
                              :isSelected="isSelected"
                              :item="item"
                              :items="items"
                              :itemsLength="itemsLength"
                              :on="on"
                              :options="options"
                              :pageStart="pageStart"
                              :pageStop="pageStop"
                              :pagination="pagination"
                              :props="props"
                              :remove="remove"
                              :select="select"
                              :sort="sort"
                              :toggle="toggle"
                              :updateOptions="updateOptions"
                              :value="value"
                              :widths="widths"
                        ></slot>
                    </template>
                </v-data-table>
            </v-card>
        </div>
    </v-fade-transition>
</template>

<script lang="ts">
    import {Component, Prop, Watch} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {DataOptions} from 'vuetify';
    import {Canceler} from '@klipper/http-client/Canceler';
    import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';
    import {FilterCondition} from '@klipper/sdk/models/filters/FilterCondition';
    import {FilterRule} from '@klipper/sdk/models/filters/FilterRule';
    import {Sort} from '@klipper/sdk/requests/Sort';
    import {FetchRequestDataListEvent} from '../../http/event/FetchRequestDataListEvent';
    import {FetchRequestDataListFunction} from '../../http/request/FetchRequestDataListFunction';
    import {SlotWrapper} from '../../slot/mixins/SlotWrapper';
    import {AjaxListContent} from '../../http/mixins/AjaxListContent';
    import {BindsAttrs} from '../../mixins/BindsAttrs';
    import KListView from '../KListView/KListView';
    import {provide as RegistrableProvide} from '../../mixins/Registrable';
    import './KDataList.scss';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KDataList extends mixins(AjaxListContent, SlotWrapper, BindsAttrs, RegistrableProvide('datalist')) {
        @Prop({type: Function, required: true})
        public fetchRequest: FetchRequestDataListFunction;

        @Prop({type: Boolean, default: false})
        public wallEmptyMessage: boolean;

        @Prop({type: Boolean, default: false})
        public disableFirstLoading: boolean;

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

        @Prop({type: Array, default: function () {
            return this.$klipper.itemsPerPage;
        }})
        public itemsPerPage: number[];

        @Prop({type: Number, default: undefined})
        public initLimit!: number;

        @Prop({type: String, default: undefined})
        public metadata!: string;

        @Prop({type: Boolean, default: true})
        public topOnRefresh!: boolean;

        @Prop({type: [Object, undefined]})
        public filters!: FilterRule|undefined;

        public tableOptions: DataOptions = {
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
        }

        private listViews: KListView[] = [];

        public get isMetadataInitialized(): boolean {
            return undefined === this.$store.state.metadata || this.$store.state.metadata.initialized;
        }

        public get isSortable(): boolean {
            return !this.disableSort && this.tableOptions.sortable;
        }

        public get isSearchable(): boolean {
            return !this.disableSearch && this.tableOptions.searchable;
        }

        public async created(): Promise<void> {
            if (!this.disableFirstLoading) {
                this.loading = true;
            }

            if (undefined !== this.initLimit) {
                this.limit = this.initLimit;
            }

            this.tableOptions.searchable = !this.disableSearch;

            await this.updateTableOptions();
        }

        public async mounted(): Promise<void> {
            this.$root.$on('k-data-list-search-out', async (searchValue: string|null) => {
                this.search = null !== searchValue ? searchValue.trim() : '';
            });

            this.$root.$on('k-data-list-delete-item', async (value: string|number, key: string = 'id') => {
                this.deleteItem(value, key);
            });

            this.$root.$emit('k-data-list-refresh-search-field');

            if (this.disableFirstLoading) {
                await this.refresh();
            }
        }

        public destroyed() {
            this.$root.$off('k-data-list-search-out');
            this.$root.$off('k-data-list-delete-item');
        }

        public register(item: KListView): void {
            this.listViews.push(item);
        }

        public unregister(item: KListView): void {
            const found = this.listViews.find(i => (i as any)._uid === (item as any)._uid);

            if (!found) {
                return;
            }

            this.listViews = this.listViews.filter(i => (i as any)._uid !== (item as any)._uid);
        }

        @Watch('isMetadataInitialized')
        public async watchIsMetadataInitialized(initialized: boolean): Promise<void> {
            if (initialized) {
                this.headers = this.$attrs.headers as any || [];
            }
        }

        @Watch('headers')
        public async watchHeaders(): Promise<void> {
            await this.updateTableOptions();
        }

        @Watch('search')
        public async searchRequest(searchValue?: string): Promise<void> {
            this.$root.$emit('k-data-list-search-in', searchValue);
            await this.fetchData(searchValue);
            this.page = 1;
            this.tableOptions.page = 1;
            this.finishLoading();
        }

        public async refresh(showSnackbar: boolean = true): Promise<void> {
            await this.fetchData(this.search ? this.search : undefined, showSnackbar);
            this.finishLoading();
        }

        public async onUpdatedOptions(options: DataOptions): Promise<void> {
            if (undefined === options.page && undefined === options.itemsPerPage) {
                options.page = this.page;
                options.itemsPerPage = this.limit;
            } else {
                this.page = options.page;
                this.limit = options.itemsPerPage;
                await this.refresh();
            }
        }

        public async fetchDataRequest(canceler: Canceler, searchValue?: string): Promise<ListResponse<object>> {
            this.headers = this.$attrs.headers as any || [];
            const sort: Sort[] = [];
            const event = new FetchRequestDataListEvent();
            event.page = this.page;
            event.limit = this.limit;
            event.pages = this.pages;
            event.total = this.total;
            event.search = this.isSearchable && searchValue ? searchValue : null;
            event.canceler = canceler;

            if (this.filters) {
                event.filters = this.filters;
            }

            for (const listView of this.listViews) {
                const filters = listView.getFilters();

                if (null === event.filters) {
                    event.filters = filters;
                } else {
                    event.filters = {
                        condition: 'AND',
                        rules: [
                            event.filters,
                            filters,
                        ],
                    } as FilterCondition;
                }
            }

            for (const i of Object.keys(this.tableOptions.sortBy)) {
                const column: string = this.tableOptions.sortBy[i];
                const columnDesc: boolean = this.tableOptions.sortDesc[i];

                for (const sortPath of this.getSortPaths(column)) {
                    sort.push(new Sort(sortPath, columnDesc ? 'DESC' : 'ASC'));
                }
            }

            event.sort = sort.length > 0 ? sort : undefined;

            if (this.topOnRefresh) {
                this.$vuetify.goTo(0);
            }

            return await this.fetchRequest(event);
        }

        protected hookAfterFetchDataRequest(canceler: Canceler): void {
            // Disable the default hook after fetch data request
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

            const meta = await this.$metadata.get(this.metadata);

            if (!meta) {
                return;
            }

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

            if (this.firstLoading) {
                await this.refresh();
            }
        }

        protected getHeaderBySortPath(sortPath: string): string|null {
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
    }
</script>
