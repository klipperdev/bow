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
            :label="label"
            :disabled="disabled"
            filled
            chips
            single-line
            clearable
            rounded
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
import {DataListFilterer} from '@klipper/bow/dataList/DataListFilterer';
import {AjaxListContent} from '@klipper/bow/mixins/http/AjaxListContent';
import {inject as RegistrableInject} from '@klipper/bow/mixins/Registrable';
import {replaceRouteQuery, restoreRouteQuery} from '@klipper/bow/utils/router';
import {Canceler} from '@klipper/http-client/Canceler';
import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';
import {FilterCondition} from '@klipper/sdk/models/filters/FilterCondition';
import {FilterResult} from '@klipper/sdk/models/filters/FilterResult';
import {FilterRule} from '@klipper/sdk/models/filters/FilterRule';
import {ListViewResponse} from '@klipper/sdk/models/responses/ListViewResponse';
import {ListRequestConfig} from '@klipper/sdk/requests/ListRequestConfig';
import {mixins} from 'vue-class-component';
import {Component, Prop, Ref, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    inheritAttrs: false,
})
export default class KListView extends mixins(
    AjaxListContent,
    RegistrableInject<'datalist', any>('datalist'),
) implements DataListFilterer {
    @Prop({type: String})
    public type!: string|undefined;

    @Prop({type: String, default: 'id'})
    public itemValue!: string;

    @Prop({type: String, default: 'label'})
    public itemText!: string;

    @Prop({type: String, default() {
        return this.$t('view.availables');
    }})
    public label!: string|undefined;

    @Prop({type: Object})
    public selectProps!: object|undefined;

    @Prop({type: String, default: 'primary'})
    public color!: string;

    @Prop({type: Boolean, default: false})
    public routeQuery!: boolean;

    @Prop({type: String})
    public routeQueryPrefix!: string|undefined;

    @Prop({type: Array, default: () => []})
    public searchFields!: string[];

    @Ref('select')
    private readonly selectRef!: Vue|any;

    private disabled: boolean = false;

    private watchIsOpenRes?: Function;

    private select: ListViewResponse|null = null;

    protected get iconDataNoResult(): object {
        return iconDataNoResult;
    }

    protected set searchInput(value: string|null) {
        this.search = value || '';
    }

    protected get searchInput(): string|null {
        return this.search || null;
    }

    private get isOpen(): boolean {
        return this.selectRef && this.selectRef.isMenuActive;
    }

    public created(): void {
        if (this.routeQuery) {
            const selectView = restoreRouteQuery<string>('v', this.$route, this.routeQueryPrefix) || null;

            this.findViewByName(selectView).then((view: ListViewResponse|null) => {
                if (view) {
                    this.select = view;
                    this.selectRef.items.push(view);
                    this.onChange(view);
                }
            });
        }
    }

    public mounted(): void {
        this.watchIsOpenRes = this.$watch(() => this.isOpen, this.watchIsOpen);
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

    public getId(): number {
        return this._uid;
    }

    public getFilters(): FilterResult {
        return this.select && this.select.filters ? this.select.filters : null;
    }

    protected async fetchDataRequest(canceler: Canceler, searchValue: string): Promise<ListResponse<ListViewResponse>> {
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
    }

    private async findViewByName(selectView: string|null): Promise<ListViewResponse|null> {
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
    }

    private onFormToggle(open: boolean): void {
        this.disabled = open;

        if (!open) {
            window.setTimeout(() => this.selectRef.$refs.input.focus());
        }
    }

    private onChange(item?: ListViewResponse): void {
        this.select = item || null;
        this.$emit('change', this.select);

        if (this.routeQuery) {
            replaceRouteQuery({
                v: this.select ? this.select.name : undefined,
            }, this.$route, this.routeQueryPrefix);
        }
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

    @Watch('search')
    private async watchSearch(searchValue?: string): Promise<void> {
        this.page = 1;
        await this.fetchData(searchValue);
    }
}
</script>
