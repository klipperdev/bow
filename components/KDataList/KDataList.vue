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
                        hide-default-footer
                        disable-sort
                        disable-filtering
                        disable-pagination
                        item-key="id">
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

        @Prop({type: Boolean, default: true})
        public wallEmptyMessage: boolean;

        @Prop({type: Boolean, default: false})
        public disableFirstLoading: boolean;

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

            return await this.fetchRequest(event);
        }
    }
</script>
