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
            metadata="group"
            large
            no-result-large
            route-query
        >
            <template v-slot:header-actions>
                <k-standard-header-button
                    icon="add"
                    :to="{name: 'settings-org-group', params: {id: 'create'}}"
                />
            </template>

            <template v-slot:data-table.item.label="{item}">
                <router-link
                    class="font-weight-bold"
                    :to="{name: 'settings-org-group', params: {org: $org, id: item.id}}"
                >
                    {{ $oc(item).label() }}
                </router-link>
            </template>

            <template v-slot:data-table.item.name="{item}">
                {{ $oc(item).name() }}
            </template>
        </k-standard-data-list>
    </v-container>
</template>

<script lang="ts">
import {DataListHeader} from '@klipper/bow/dataList/DataListHeader';
import {FetchRequestDataListEvent} from '@klipper/bow/http/event/FetchRequestDataListEvent';
import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';
import {MetaInfo} from 'vue-meta';
import {Component, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class OrganizationGroupList extends Vue {
    private get headers(): DataListHeader[] {
        return [
            {
                text: this.$mfl('group', 'label'),
                value: 'label',
            },
            {
                text: this.$mfl('group', 'name'),
                value: 'name',
            },
        ];
    }

    public metaInfo(): MetaInfo {
        return {
            title: this.$mpl('group'),
        };
    }

    private async fetchRequest(event: FetchRequestDataListEvent): Promise<ListResponse> {
        return await this.$api.requestList({
            method: 'GET',
            url: '/{organization}/groups',
            limit: event.limit,
            page: event.page,
            search: event.search || undefined,
            searchFields: event.searchFields || undefined,
            viewsDetails: event.viewsDetails || undefined,
            sort: event.sort,
            filter: event.filters || undefined,
            fields: [
                'id',
                'group.label',
                'group.name',
            ],
        }, event.canceler);
    }
}
</script>
