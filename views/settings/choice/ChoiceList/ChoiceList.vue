<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-container
        fluid
    >
        <k-standard-data-list
            ref="dataList"
            :headers="headers"
            :fetch-request="fetchRequest"
            metadata="choice"
            large
            no-result-large
            route-query
            :query-builder-transformer="queryBuilderTransformer"
        >
            <template v-slot:query-builder.fields="{data, filter}">
                <k-standard-view-section
                    :value="data"
                    edit-mode
                    locked
                >
                    <v-row>
                        <k-standard-view-field-text
                            metadata="choice"
                            name="label"
                            :required="false"
                            dense
                            @keydown.enter="filter()"
                            autofocus
                        />

                        <k-standard-view-field-text
                            metadata="choice"
                            name="value"
                            :required="false"
                            dense
                            @keydown.enter="filter()"
                        />
                    </v-row>

                    <v-row>
                        <k-standard-view-field-text
                            metadata="choice"
                            name="type"
                            :required="false"
                            dense
                            @keydown.enter="filter()"
                        />
                    </v-row>
                </k-standard-view-section>
            </template>

            <template v-slot:header-actions>
                <k-standard-header-button
                    icon="add"
                    :to="{name: 'settings-choice', params: {id: 'create'}}"
                />
            </template>

            <template v-slot:data-table.item.label="{item}">
                <router-link
                    class="font-weight-bold"
                    :to="{name: 'settings-choice', params: {org: self.$org, id: item.id}}"
                >
                    {{ $oc(item).label() }}
                </router-link>
            </template>

            <template v-slot:data-table.item.icon="{item}">
                <k-icon
                    :value="self.$oc(item).icon()"
                    :color="self.$oc(item).color()"
                />
            </template>

            <template v-slot:data-table.item.color="{item}">
                <k-color :value="self.$oc(item).color()"/>
            </template>

            <template v-slot:data-table.item.updated_at="{item}">
                {{ $datetime($oc(item).updated_at()) }}
            </template>
        </k-standard-data-list>
    </v-container>
</template>

<script lang="ts">
import {DataListHeader} from '@klipper/bow/dataList/DataListHeader';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {FetchRequestDataListEvent} from '@klipper/bow/http/event/FetchRequestDataListEvent';
import {Selfable} from '@klipper/bow/mixins/Selfable';
import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';
import {FilterCondition} from '@klipper/sdk/models/filters/FilterCondition';
import {FilterResult} from '@klipper/sdk/models/filters/FilterResult';
import {mixins} from 'vue-class-component';
import {MetaInfo} from 'vue-meta';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class ChoiceList extends mixins(
    Selfable,
) {
    private get headers(): DataListHeader[] {
        return [
            {
                text: this.$mfl('choice', 'label'),
                value: 'label',
            },
            {
                text: this.$mfl('choice', 'type'),
                value: 'type',
            },
            {
                text: this.$mfl('choice', 'value'),
                value: 'value',
            },
            {
                text: this.$mfl('choice', 'icon'),
                value: 'icon',
                sortable: false,
            },
            {
                text: this.$mfl('choice', 'color'),
                value: 'color',
                sortable: false,
                align: 'center',
            },
            {
                text: this.$mfl('choice', 'position'),
                value: 'position',
                align: 'center',
            },
            {
                text: this.$mfl('choice', 'updated_at'),
                value: 'updated_at',
            },
        ];
    }

    public metaInfo(): MetaInfo {
        return {
            title: this.$mpl('choice'),
        };
    }

    protected queryBuilderTransformer(data: Dictionary<any>): FilterResult {
        const filter = {
            condition: 'AND',
            rules: [],
        } as FilterCondition;

        if (data.label) {
            filter.rules.push({
                field: 'label',
                operator: 'contains',
                value: data.label,
            });
        }

        if (data.value) {
            filter.rules.push({
                field: 'value',
                operator: 'contains',
                value: data.value,
            });
        }

        if (data.type) {
            filter.rules.push({
                field: 'type',
                operator: 'contains',
                value: data.type,
            });
        }

        return filter;
    }

    private async fetchRequest(event: FetchRequestDataListEvent): Promise<ListResponse> {
        return await this.$api.requestList({
            method: 'GET',
            url: '/{organization}/choices',
            limit: event.limit,
            page: event.page,
            search: event.search || undefined,
            searchFields: event.searchFields || undefined,
            viewsDetails: event.viewsDetails || undefined,
            sort: event.sort,
            filter: event.filters || undefined,
            fields: [
                'id',
                'choice.type',
                'choice.label',
                'choice.value',
                'choice.position',
                'choice.color',
                'choice.icon',
                'choice.updated_at',
            ],
        }, event.canceler);
    }
}
</script>
