<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div
        class="k-list-view"
    >
        <v-autocomplete
            ref="select"
            v-model="select"
            v-bind="selectProps"
            :search-input.sync="searchInput"
            :items="items"
            :loading="loading"
            :color="color"
            :item-text="itemText"
            :item-value="itemValue"
            :label="genLabel"
            :disabled="disabled || formDisabled"
            single-line
            clearable
            :menu-props="{rounded: true}"
            hide-details
            hide-selected
            return-object
            prepend-inner-icon="fa-fw fa-filter"
            @change="onChange"
        >
            <template v-slot:no-data>
                <v-container
                    v-if="!!search && 0 === items.length"
                    class="pa-0"
                    fluid
                    fill-height
                >
                    <v-row
                        align="center"
                        justify="center"
                    >
                        <v-col
                            class="text-align-center"
                        >
                            <k-lottie
                                center
                                width="140px"
                                :options="{animationData: iconDataNoResult, loop: false}"
                            />

                            <h5
                                class="mt-2 mb-5"
                            >
                                {{ $t('view.no-result') }}
                            </h5>
                        </v-col>
                    </v-row>
                </v-container>

                <span v-else/>
            </template>

            <template v-slot:prepend-item>
                <v-list-item
                    @click="$refs.form.open()"
                >
                    <v-list-item-title>
                        {{ $t('view.create') }}
                    </v-list-item-title>

                    <v-list-item-action>
                        <v-btn
                            small
                            icon
                            text
                            color="primary"
                        >
                            <v-icon
                                small
                            >
                                fa-fw fa-plus-circle
                            </v-icon>
                        </v-btn>
                    </v-list-item-action>
                </v-list-item>
            </template>

            <template v-slot:item="{item}">
                <v-list-item-title>
                    {{ item.label }}
                </v-list-item-title>

                <v-list-item-action>
                    <v-btn
                        small
                        icon
                        text
                        color="primary"
                        @click.stop="$refs.form.open(item)"
                    >
                        <v-icon
                            x-small
                        >
                            fa-fw fa-pen
                        </v-icon>
                    </v-btn>
                </v-list-item-action>
            </template>

            <template v-slot:selection="{attr, on, item, selected, disabled}">
                <v-chip
                    v-bind="attr"
                    :input-value="selected"
                    :color="color"
                    :disabled="disabled"
                    class="white--text"
                    v-on="on"
                    @click="$refs.form.open(item)"
                >
                    <v-icon
                        left
                        x-small
                    >
                        fa-fw fa-sliders-h
                    </v-icon>

                    <span
                        v-text="item.label"
                    />
                </v-chip>
            </template>
        </v-autocomplete>

        <k-list-view-form
            ref="form"
            :type="type"
            :btn-props="formBtnProps"
            :input-props="formInputProps"
            :route-query-prefix="routeQueryPrefix"
            @change="onChangeList"
            @delete="onDelete"
            @toggle="onFormToggle"
        />

        <slot
            name="default"
        />
    </div>
</template>

<script lang="ts">
import iconDataNoResult from '@klipper/bow/assets/animations/searchNoResult.json';
import {AjaxListContent} from '@klipper/bow/composables/mixins/http/ajaxListContent';
import {inject as RegistrableInject} from '@klipper/bow/composables/mixins/registrable';
import {DataListFilterer} from '@klipper/bow/dataList/DataListFilterer';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {replaceRouteQuery, restoreRouteQuery} from '@klipper/bow/utils/router';
import {Canceler} from '@klipper/http-client/Canceler';
import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';
import {FilterCondition} from '@klipper/sdk/models/filters/FilterCondition';
import {FilterResult} from '@klipper/sdk/models/filters/FilterResult';
import {FilterRule} from '@klipper/sdk/models/filters/FilterRule';
import {ListViewResponse} from '@klipper/sdk/models/responses/ListViewResponse';
import {ListRequestConfig} from '@klipper/sdk/requests/ListRequestConfig';
import {defineComponent, PropType} from '@vue/composition-api';
import {Vue} from 'vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default defineComponent({
    name: 'KListView',

    inheritAttrs: false,

    mixins: [
        AjaxListContent,
        RegistrableInject<'datalist', any>('datalist'),
    ],

    props: {
        type: {
            type: String,
            default: undefined,
        },

        itemValue: {
            type: String,
            default: 'id',
        },

        itemText: {
            type: String,
            default: 'label',
        },

        label: {
            type: String,
            default: undefined,
        },

        selectProps: {
            type: Object as PropType<Dictionary<any>>,
            default: () => ({}),
        },

        color: {
            type: String,
            default: 'primary',
        },

        disabled: {
            type: Boolean,
            default: false,
        },

        routeQuery: {
            type: Boolean,
            default: false,
        },

        routeQueryPrefix: {
            type: String,
            default: undefined,
        },

        searchFields: {
            type: Array as PropType<string[]>,
            default: () => ([]),
        },

        formBtnProps: {
            type: Object as PropType<Dictionary<any>>,
            default: () => ({}),
        },

        formInputProps: {
            type: Object as PropType<Dictionary<any>>,
            default: () => ({}),
        },
    },

    data(): Dictionary<any> {
        return {
            formDisabled: false as boolean,
            select: null as ListViewResponse|null,
            watchIsOpenRes: undefined as Function|undefined,
        };
    },

    computed: {
        genLabel(): string {
            return this.label || this.$t('view.availables') as string;
        },

        iconDataNoResult(): Dictionary<any> {
            return iconDataNoResult;
        },

        searchInput: {
            get(): string|null {
                return this.search || null;
            },

            set(value: string|null) {
                this.search = value || '';
            },
        },

        isOpen(): boolean {
            return this.$refs?.select?.isMenuActive || false;
        },
    },

    created(): void {
        if (this.routeQuery) {
            const selectView = restoreRouteQuery<string>('v', this.$route, this.routeQueryPrefix) || null;

            this.findViewByName(selectView).then((view: ListViewResponse|null) => {
                if (view) {
                    this.select = view;
                    this.$refs.select.items.push(view);
                    this.onChange(view);
                }
            });
        }
    },

    mounted(): void {
        this.watchIsOpenRes = this.$watch(() => this.isOpen, this.watchIsOpen);
    },

    destroyed(): void {
        if (this.watchIsOpenRes) {
            this.watchIsOpenRes();
        }
    },

    methods: {
        getId(): number {
            return this._uid;
        },

        getFilters(): FilterResult {
            return this.select?.filters || null;
        },

        async fetchDataRequest(canceler: Canceler, searchValue: string): Promise<ListResponse<ListViewResponse>> {
            return await this.$api.requestList({
                url: this.$org + '/list_views',
                page: this.page,
                limit: this.limit,
                search: searchValue,
                searchFields : this.searchFields.length > 0 ? this.searchFields : undefined,
                sort: 'label:asc',
                fields: [
                    'id',
                    'label',
                    'name',
                    'filters',
                ],
                filter: this.type ? {field: 'type', operator: 'equal', value: this.type} as FilterRule : undefined,
            } as ListRequestConfig, canceler);
        },

        async findViewByName(selectView: string|null): Promise<ListViewResponse|null> {
            if (selectView) {
                const canceler = new Canceler();
                this.previousRequests.add(canceler);

                const filter = {
                    condition: 'AND',
                    rules: [
                        {
                            field: 'name',
                            operator: 'equal',
                            value: selectView,
                        },
                    ],
                } as FilterCondition;

                if (this.type) {
                    filter.rules.push({field: 'type', operator: 'equal', value: this.type});
                }

                try {
                    this.loading = true;
                    const res = await this.$api.requestList<ListViewResponse>({
                        url: this.$org + '/list_views',
                        limit: 1,
                        filter,
                        fields: [
                            'id',
                            'label',
                            'name',
                            'filters',
                        ],
                    } as ListRequestConfig, canceler);

                    this.previousRequests.remove(canceler);
                    this.loading = false;

                    if (1 === res.results.length) {
                        return res.results[0];
                    }
                } catch (e) {
                    this.previousRequests.remove(canceler);
                    this.loading = false;
                }
            }

            return null;
        },

        onFormToggle(open: boolean): void {
            this.formDisabled = open;

            if (!open) {
                window.setTimeout(() => this.$refs.select.$refs.input.focus());
            }
        },

        onChange(item?: ListViewResponse): void {
            this.select = item || null;
            this.$emit('change', this.select);

            if (this.routeQuery) {
                replaceRouteQuery({
                    v: this.select ? this.select.name : undefined,
                }, this.$route, this.routeQueryPrefix);
            }
        },

        async onChangeList(item: ListViewResponse): Promise<void> {
            this.onChange(item);
            await this.refresh();
        },

        async onDelete(id: string|number): Promise<void> {
            this.deleteItem(id);

            if (this.select && id === this.select.id) {
                this.onChange(undefined);
            }
        },

        async watchIsOpen(open: boolean): Promise<void> {
            if (open) {
                await this.refresh();
            }
        },
    },

    watch: {
        search: {
            async handler(searchValue?: string): Promise<void> {
                this.page = 1;
                await this.fetchData(searchValue);
            },
        }
    },
}) as Vue&DataListFilterer;
</script>
