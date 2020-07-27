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
                        :multi-sort="multiSort"
                        :disable-sort="disableSort"
                        :server-items-length="total"
                        :items-per-page="limit"
                        :show-select="showSelect"
                        :single-select="singleSelect"
                        :search="search"
                        :page="page"
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
    import {AjaxListContent} from '../../http/mixins/AjaxListContent';
    import {FetchRequestDataEvent} from '../../http/event/FetchRequestDataEvent';
    import {FetchRequestDataFunction} from '../../http/request/FetchRequestDataFunction';
    import {SlotWrapper} from '../../slot/mixins/SlotWrapper';
    import './KDataList.scss';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KDataList extends mixins(AjaxListContent, SlotWrapper) {
        @Prop({type: Function, required: true})
        public fetchRequest: FetchRequestDataFunction;

        @Prop({type: Boolean, default: false})
        public wallEmptyMessage: boolean;

        @Prop({type: Boolean, default: false})
        public disableFirstLoading: boolean;

        @Prop({type: Boolean, default: false})
        public disableSort: boolean;

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

        public tableOptions: DataOptions = {
            page: this.page,
            itemsPerPage: this.limit,
            sortBy: [],
            sortDesc: [],
            groupBy: [],
            groupDesc: [],
            multiSort: this.multiSort,
            mustSort: false,
        }

        public get isMetadataInitialized(): boolean {
            return undefined === this.$store.state.metadata || this.$store.state.metadata.initialized;
        }

        public async created(): Promise<void> {
            await this.fetchData();
        }

        public mounted(): void {
            this.$root.$on('k-data-list-search-out', async (searchValue: string|null) => {
                this.search = null !== searchValue ? searchValue.trim() : '';
            });

            this.$root.$on('k-data-list-delete-item', async (value: string|number, key: string = 'id') => {
                this.deleteItem(value, key);
            });

            this.$root.$emit('k-data-list-refresh-search-field');
        }

        public destroyed() {
            this.$root.$off('k-data-list-search-out');
            this.$root.$off('k-data-list-delete-item');
        }

        @Watch('isMetadataInitialized')
        public async watchIsMetadataInitialized(initialized: boolean): Promise<void> {
            if (initialized) {
                this.headers = this.$attrs.headers as any || [];
            }
        }

        @Watch('search')
        public async searchRequest(searchValue?: string): Promise<void> {
            this.$root.$emit('k-data-list-search-in', searchValue);
            await this.fetchData(searchValue);
            this.finishLoading();
        }

        public async refresh(showSnackbar: boolean = true): Promise<void> {
            await this.fetchData(this.search ? this.search : undefined, showSnackbar);
            this.finishLoading();
        }

        public async onUpdatedOptions(options: DataOptions): Promise<void> {
            if (this.loading) {
                this.finishLoading();
            } else {
                this.page = options.page;
                this.limit = options.itemsPerPage;
                await this.refresh();
                this.finishLoading();
            }
        }

        public async fetchDataRequest(canceler: Canceler, searchValue?: string): Promise<ListResponse<object>> {
            this.headers = this.$attrs.headers as any || [];
            const event = new FetchRequestDataEvent();
            event.page = this.page;
            event.limit = this.limit;
            event.pages = this.pages;
            event.total = this.total;
            event.search = searchValue ? searchValue : null;
            event.canceler = canceler;

            this.$vuetify.goTo(0);

            return await this.fetchRequest(event);
        }

        protected hookAfterFetchDataRequest(canceler: Canceler): void {
            this.tableOptions.page = this.page;
            this.tableOptions.itemsPerPage = this.limit;
        }
    }
</script>
