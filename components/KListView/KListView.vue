<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div class="k-list-view">
        <v-autocomplete
            ref="select"
            v-model="select"
            v-bind="selectProps"
            :search-input.sync="searchInput"
            :items="items"
            :loading="loading"
            :color="$color(color, colorDark)"
            :item-text="itemText"
            :item-value="itemValue"
            :label="label"
            filled
            chips
            single-line
            clearable
            hide-details
            hide-selected
            return-object
            prepend-inner-icon="fa fw fa-filter"
            @change="onChange"
        >
            <template v-slot:no-data>
                <v-expand-transition>
                    <v-container
                        v-if="!!search && 0 === items.length"
                        class="pa-0"
                        fluid
                        fill-height
                    >
                        <v-row no-gutters align="center" justify="center">
                            <v-col class="text-align-center">
                                <k-lottie
                                    center
                                    width="140px"
                                    :options="{animationData: iconDataNoResult, loop: false}"
                                ></k-lottie>

                                <h5 class="mt-2 mb-5">{{ $t('view.no-result') }}</h5>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-expand-transition>
            </template>

            <template v-slot:prepend-item>
                <v-list-item @click="$refs.form.open()">
                    <v-list-item-title>
                        {{ $t('view.create') }}
                    </v-list-item-title>

                    <v-list-item-action>
                        <v-btn small icon depressed :color="$color('primary', 'lighten-3')">
                            <v-icon x-small>fa fw fa-plus</v-icon>
                        </v-btn>
                    </v-list-item-action>
                </v-list-item>
            </template>

            <template v-slot:item="{item}">
                <v-list-item-title>
                    {{ item.label }}
                </v-list-item-title>

                <v-list-item-action>
                    <v-btn small icon depressed :color="$color('primary', 'lighten-3')"
                           @click.stop="$refs.form.open(item)"
                    >
                        <v-icon x-small>fa fw fa-pen</v-icon>
                    </v-btn>
                </v-list-item-action>
            </template>

            <template v-slot:selection="{attr, on, item, selected}">
                <v-chip
                    v-bind="attr"
                    :input-value="selected"
                    :color="$color(color, colorDark)"
                    class="white--text"
                    v-on="on"
                    @click="$refs.form.open(item)"
                >
                    <v-icon left x-small>fa fw fa-sliders-h</v-icon>
                    <span v-text="item.label"></span>
                </v-chip>
            </template>
        </v-autocomplete>

        <k-list-view-form
            ref="form"
            :type="type"
            @change="onChangeList"
            @delete="onDelete"
        ></k-list-view-form>

        <slot name="default"></slot>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Ref, Watch} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {Canceler} from '@klipper/http-client/Canceler';
    import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';
    import {ListRequestConfig} from '@klipper/sdk/requests/ListRequestConfig';
    import {ListViewResponse} from '@klipper/sdk/models/responses/ListViewResponse';
    import {FilterRule} from '@klipper/sdk/models/filters/FilterRule';
    import {AjaxListContent} from '@klipper/bow/mixins/http/AjaxListContent';
    import {inject as RegistrableInject} from '@klipper/bow/mixins/Registrable';
    import KDataList from '@klipper/bow/components/KDataList/KDataList';
    import iconDataNoResult from '@klipper/bow/assets/animations/searchNoResult.json';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component({
        inheritAttrs: false,
    })
    export default class KListView extends mixins(AjaxListContent, RegistrableInject<KDataList, any>('datalist')) {
        @Prop({type: String, default: undefined})
        public type!: string|undefined;

        @Prop({type: String, default: 'id'})
        public itemValue!: string;

        @Prop({type: String, default: 'label'})
        public itemText!: string;

        @Prop({type: String, default: function () {
            return this.$t('view.availables');
        }})
        public label!: string|undefined;

        @Prop({type: Object, default: undefined})
        public selectProps!: object|undefined;

        @Prop({type: String, default: 'primary'})
        public color!: string;

        @Prop({type: String, default: 'primary lighten-3'})
        public colorDark!: string;

        @Ref('select')
        private readonly selectRef: any;

        private watchIsOpenRes?: Function;

        private select!: ListViewResponse|null = null;

        public get iconDataNoResult(): object {
            return iconDataNoResult;
        }

        public set searchInput(value: string|null) {
            this.search = value || '';
        }

        public get searchInput(): string|null {
            return this.search || null;
        }

        public get isOpen(): boolean {
            return this.selectRef && this.selectRef.isMenuActive;
        }

        public created(): void {
            if ((this as any).datalist) {
                (this as any).datalist.register(this);
            }
        }

        public mounted(): void {
            this.watchIsOpenRes = this.$watch(() => this.isOpen, this.watchIsOpen);
        }

        public beforeDestroy(): void {
            if ((this as any).datalist) {
                (this as any).datalist.unregister(this);
            }
        }

        public destroyed(): void {
            if (this.watchIsOpenRes) {
                this.watchIsOpenRes();
            }
        }

        public async watchIsOpen(open: boolean): Promise<void> {
            if (open) {
                await this.refresh();
            }
        }

        @Watch('search')
        public async watchSearch(searchValue?: string): Promise<void> {
            await this.fetchData(searchValue);
        }

        public getFilters(): any|null {
            return this.select && this.select.filters ? this.select.filters : null;
        }

        public async fetchDataRequest(canceler: Canceler, searchValue: string): Promise<ListResponse<ListViewResponse>> {
            return await this.$api.requestList({
                url: this.$org + '/list_views',
                page: this.page,
                limit: this.limit,
                search: searchValue,
                sort: 'label:asc',
                fields: [
                    'id',
                    'label',
                    'name',
                    'filters',
                ],
                filter: this.type ? {field: 'type', operator: 'equal', value: this.type} as FilterRule : undefined,
            } as ListRequestConfig, canceler);
        }

        private onChange(item?: ListViewResponse): void {
            this.select = item || null;
            this.$emit('change', this.select);
        }

        private async onChangeList(item: ListViewResponse): Promise<void> {
            this.onChange(item);
            await this.refresh();
        }

        private async onDelete(id: string|number): Promise<void> {
            this.deleteItem(id);

            if (this.select && id === this.select.id) {
                this.onChange(undefined);
            }
        }
    }
</script>
