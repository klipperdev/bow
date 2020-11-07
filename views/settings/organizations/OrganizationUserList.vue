<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-container fluid>
        <k-data-list ref="dataList"
                     :headers="headers"
                     :fetch-request="fetchRequest"
                     large
                     no-result-large
                     metadata="organization_user"
                     route-query
        >
            <template v-slot:header="{total}">
                <v-subheader :class="$classes('pl-0 mt-4 mb-4 primary--text', 'text--lighten-3')">
                    <k-list-view v-if="!!$refs.dataList"
                                 type="organization_user"
                                 :route-query="$refs.dataList.routeQuery"
                                 :route-query-prefix="$refs.dataList.routeQueryPrefix"
                                 @change="$refs.dataList.refresh"
                    >
                    </k-list-view>

                    <v-fade-transition mode="out-in">
                        <v-chip small outlined class="ml-2" v-if="null !== total">
                            {{ $number(total, 0) }}
                        </v-chip>
                    </v-fade-transition>
                </v-subheader>
            </template>

            <template v-slot:data-table.item.image="{item}">
                <k-user-avatar :size="38" right :user="item.user" :tooltip="false"></k-user-avatar>
            </template>

            <template v-slot:data-table.item.name="{item}">
                <router-link class="font-weight-bold" :to="{name: 'settings-org-user', params: {org: $org, id: item.id}}">
                    {{ $oc(item).user.full_name($oc(item).user.username()) }}
                </router-link>
            </template>

            <template v-slot:data-table.item.enabled="{item}">
                <v-simple-checkbox disabled :value="item.enabled"></v-simple-checkbox>
            </template>

            <template v-slot:data-table.item.updated_at="{item}">
                {{ $datetime(item.updated_at) }}
            </template>

        </k-data-list>
    </v-container>
</template>

<script lang="ts">
    import {MetaInfo} from 'vue-meta';
    import {Component, Vue} from 'vue-property-decorator';
    import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';
    import {FetchRequestDataListEvent} from '@klipper/bow/http/event/FetchRequestDataListEvent';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class OrganizationUserList extends Vue {
        public get headers(): object[] {
            return [
                {   text: '',
                    align: 'left',
                    value: 'image',
                    width: 40,
                },
                {   text: this.$mfl('user', 'full_name'),
                    align: 'left',
                    value: 'name',
                    sortPath: ['user.first_name', 'user.last_name'],
                },
                {   text: this.$mfl('organization_user', 'enabled'),
                    align: 'left',
                    value: 'enabled',
                },
                {   text: this.$mfl('organization_user', 'updated_at'),
                    align: 'left',
                    value: 'updated_at',
                },
            ];
        }

        public metaInfo(): MetaInfo {
            return {
                title: this.$mpl('organization_user'),
            };
        }

        public async fetchRequest(event: FetchRequestDataListEvent): Promise<ListResponse> {
            return await this.$api.requestList({
                method: 'GET',
                url: '/{organization}/organization_users',
                limit: event.limit,
                page: event.page,
                search: event.search || undefined,
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
