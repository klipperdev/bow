<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-select
        ref="select"
        v-bind="selectAttrs"
        v-on="$listeners"
        @focus="onFocus"
    >
        <template v-slot:prepend-item>
            <v-text-field
                v-model="search"
                full-width
                hide-details
                :label="$t('search')"
                prepend-inner-icon="search"
                single-line
                solo
                flat
                clearable
                dense
                autofocus
                autocomplete="off"
                color="accent"
            ></v-text-field>

            <k-menu-pagination
                v-if="paginationPages > 1"
                :page="page"
                :limit="limit"
                :pages="paginationPages"
                :total="paginationTotal"
                @previous="previousPage"
                @next="nextPage"
            ></k-menu-pagination>

            <v-progress-linear v-if="loading"
                               indeterminate
                               absolute
                               color="accent"
                               :height="$attrs['loader-height'] || 2"
            ></v-progress-linear>
        </template>

        <template v-slot:append-item>
            <k-menu-pagination
                v-if="paginationPages > 1"
                :page="page"
                :limit="limit"
                :pages="paginationPages"
                :total="paginationTotal"
                @previous="previousPage"
                @next="nextPage"
            ></k-menu-pagination>
        </template>

        <template v-slot:no-data>
            <v-list v-if="loading">
                <v-list-item>
                    <k-loading class="mt-1" progress-color=""></k-loading>
                </v-list-item>
            </v-list>

            <k-no-result-message dense v-else></k-no-result-message>
        </template>

        <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope" />
        </template>
    </v-select>
</template>

<script lang="ts">
    import {Component, Prop, Watch} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {Canceler} from '@klipper/http-client/Canceler';
    import {AjaxListContent} from '@klipper/bow/mixins/http/AjaxListContent';
    import {FetchRequestDataListFunction} from '@klipper/bow/http/request/FetchRequestDataListFunction';
    import {FetchRequestDataListEvent} from '@klipper/bow/http/event/FetchRequestDataListEvent';
    import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';
    import {FilterCondition} from '@klipper/sdk/models/filters/FilterCondition';
    import {FilterRule} from '@klipper/sdk/models/filters/FilterRule';
    import {Sort} from '@klipper/sdk/requests/Sort';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KSelectEntity<I = object> extends mixins<I>(AjaxListContent) {
        @Prop({type: Function})
        public fetchRequest!: FetchRequestDataListFunction;

        @Prop({type: String, default: undefined})
        public targetMetadata!: string;

        @Prop({type: Number, default: 100})
        public initLimit!: number;

        @Prop({type: Object, default: undefined})
        public filters!: FilterCondition|FilterRule;

        @Prop({type: [Sort, String, Array]})
        public sort!: Sort|Sort[]|string|string[];

        @Prop({type: Array, default: () => {
            return [];
        }})
        public fields!: string[];

        public get selectAttrs(): any {
            const multiple = !!this.$attrs['multiple'] || '' === this.$attrs['multiple'];

            return Object.assign({
                loading: this.loading,
                dense: true,
                clearable: true,
                chips: multiple,
                'small-chips': multiple,
                'deletable-chips': multiple,
                'return-object': true,
                'item-value': this.itemValue,
                'item-text': this.itemText,
                'hide-selected': true,
                placeholder: this.$t('select.placeholder'),
                items: this.items,
            }, this.$attrs);
        }

        public get itemValue(): string {
            if (this.$attrs['item-value']) {
                return this.$attrs['item-value'];
            }

            return this.targetMetadata && this.$store.state.metadata && this.$store.state.metadata.metadatas[this.targetMetadata]
                ? this.$store.state.metadata.metadatas[this.targetMetadata].fieldIdentifier
                : 'id';
        }

        public get itemText(): string {
            if (this.$attrs['item-text']) {
                return this.$attrs['item-text'];
            }

            return this.targetMetadata && this.$store.state.metadata && this.$store.state.metadata.metadatas[this.targetMetadata]
                ? this.$store.state.metadata.metadatas[this.targetMetadata].fieldLabel
                : 'id';
        }

        public get paginationPages(): number {
            return Math.ceil(this.paginationTotal / this.limit);
        }

        public get paginationTotal(): number {
            const hideSelected = !!this.selectAttrs['hide-selected'] || '' === this.selectAttrs['hide-selected'];

            if (hideSelected) {
                const res = this.total - this.getSelectValue().length;

                return res >= 0 ? res : 0;
            }

            return this.total;
        }

        public mounted(): void {
            if (!this.fetchRequest && !this.targetMetadata) {
                throw new Error('The "targetMetadata" props or the "fetchRequest" props must be defined');
            }

            if (undefined !== this.initLimit) {
                this.limit = this.initLimit;
            }

            this.items = this.getSelectValue();
        }

        public async previousPage(): Promise<void> {
            if (this.page > 1) {
                this.page--;
                await this.refresh();
            }
        }

        public async nextPage(): Promise<void> {
            if (this.page < this.pages) {
                this.page++;
                await this.refresh();
            }
        }

        public async fetchDataRequest(canceler: Canceler, searchValue: string): Promise<ListResponse<I>> {
            const event = new FetchRequestDataListEvent();
            event.page = this.page;
            event.limit = this.limit;
            event.pages = this.pages;
            event.total = this.total;
            event.search = searchValue ? searchValue : null;
            event.canceler = canceler;
            event.filters = this.filters || null;
            event.sort = this.sort;

            return this.fetchRequest
                ? await this.fetchRequest(event)
                : await this.standardFetchRequest(event);
        }

        protected hookAfterFetchDataRequest(): void {
            const valueItems = [];
            let valueInjected = false;

            this.items.forEach((item: any) => {
                valueItems.push(item[this.itemValue]);
            });

            this.getSelectValue().forEach((item: any) => {
                if (valueItems.indexOf(item[this.itemValue]) < 0) {
                    this.items.push(item);
                    valueInjected = true;
                }
            });

            if (valueInjected) {
                this.items.sort((a: any, b: any) => {
                    if (a.label < b.label) {
                        return -1;
                    } else if (a.label > b.label) {
                        return 1;
                    }

                    return 0;
                });
            }

            this.finishLoading();

            // force to resize and update the position of the menu
            this.$refs.select.$refs.menu.onResize();
        }

        private getSelectValue(): any[] {
            if (!this.$refs.select) {
                return [];
            }

            if (!!this.$attrs['multiple'] || '' === this.$attrs['multiple']) {
                return this.$refs.select.value || [];
            }

            return this.$refs.select.value ? [this.$refs.select.value] : [];
        }

        private async standardFetchRequest(event: FetchRequestDataListEvent): Promise<ListResponse> {
            if (!this.targetMetadata) {
                throw new Error('The "targetMetadata" props is required if the "fetchRequest" props is not defined');
            }

            if (!this.$store.state.metadata || !this.$store.state.metadata.metadatas[this.targetMetadata]) {
                throw new Error('The "' + this.targetMetadata + '" metadata in "targetMetadata" props is not defined');
            }

            return await this.$api.requestList({
                method: 'GET',
                url: '/{organization}/' + this.$store.state.metadata.metadatas[this.targetMetadata].pluralName,
                limit: event.limit,
                page: event.page,
                search: event.search || undefined,
                sort: event.sort,
                filter: event.filters || undefined,
                fields: [
                    this.itemValue,
                    this.itemText,
                    ...this.fields,
                ],
            }, event.canceler);
        }

        private async onFocus(): Promise<void> {
            if (!this.isInitialized) {
                await this.refresh();
            }
        }

        @Watch('search')
        private async watchSearchRequest(searchValue?: string): Promise<void> {
            if (!this.isInitialized) {
                return;
            }

            this.page = 1;
            await this.fetchData(searchValue);
        }
    }
</script>
