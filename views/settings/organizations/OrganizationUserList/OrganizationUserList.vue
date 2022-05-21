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
            metadata="organization_user"
            large
            no-result-large
            route-query
        >
            <template v-slot:header-actions>
                <k-standard-header-button
                    icon="add"
                    :to="{name: 'settings-org-user', params: {id: 'create'}}"
                />
            </template>

            <template v-slot:data-table.item.image="{item}">
                <k-user-avatar
                    :size="38"
                    right
                    :user="item.user"
                    :tooltip="false"
                />
            </template>

            <template v-slot:data-table.item.name="{item}">
                <router-link
                    class="font-weight-bold"
                    :to="{name: 'settings-org-user', params: {org: self.$org, id: item.id}}"
                >
                    {{ $oc(item).user.full_name($oc(item).user.username()) }}
                </router-link>
            </template>

            <template v-slot:data-table.item.enabled="{item}">
                <k-checkbox :value="self.$oc(item).enabled()"/>
            </template>

            <template v-slot:data-table.item.updated_at="{item}">
                {{ $datetime(self.$oc(item).updated_at()) }}
            </template>
        </k-standard-data-list>
    </v-container>
</template>

<script lang="ts">
import {DataListHeader} from '@klipper/bow/dataList/DataListHeader';
import {FetchRequestDataListEvent} from '@klipper/bow/http/event/FetchRequestDataListEvent';
import {Selfable} from '@klipper/bow/mixins/Selfable';
import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';
import {mixins} from 'vue-class-component';
import {MetaInfo} from 'vue-meta';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class OrganizationUserList extends mixins(
    Selfable,
) {
    private get headers(): DataListHeader[] {
        return [
            {
                text: '',
                value: 'image',
                width: 40,
            },
            {
                text: this.$mfl('user', 'full_name'),
                value: 'name',
                sortPath: ['user.first_name', 'user.last_name'],
            },
            {
                text: this.$mfl('organization_user', 'enabled'),
                value: 'enabled',
            },
            {
                text: this.$mfl('organization_user', 'updated_at'),
                value: 'updated_at',
            },
        ];
    }

    public metaInfo(): MetaInfo {
        return {
            title: this.$mpl('organization_user'),
        };
    }

    private async fetchRequest(event: FetchRequestDataListEvent): Promise<ListResponse> {
        return await this.$api.requestList({
            method: 'GET',
            url: '/{organization}/organization_users',
            limit: event.limit,
            page: event.page,
            search: event.search || undefined,
            searchFields: event.searchFields || undefined,
            viewsDetails: event.viewsDetails || undefined,
            sort: event.sort,
            filter: event.filters || undefined,
            fields: [
                'id',
                'organization_user.roles',
                'organization_user.updated_at',
                'organization_user.enabled',
                'organization_user.user',
                'user.alias',
                'user.username',
                'user.full_name',
                'user.image_url',
            ],
        }, event.canceler);
    }
}
</script>
