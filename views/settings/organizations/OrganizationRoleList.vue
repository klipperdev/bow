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
                     :table-props="{class: 'large-rows'}"
                     metadata="role"
        >
            <template v-slot:no-items>
                <k-no-result-message></k-no-result-message>
            </template>

            <template v-slot:header="{total}">
                <v-subheader :class="$classes('pl-0 mt-4 mb-4 primary--text', 'text--lighten-3')">
                    <k-list-view type="role"
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

            <template v-slot:data-table.item.label="{item}">
                <router-link class="font-weight-bold" :to="{name: 'settings-org-role', params: {org: $org, id: item.id}}">
                    {{ $oc(item).label() }}
                </router-link>
            </template>

            <template v-slot:data-table.item.name="{item}">
                {{ $oc(item).name() }}
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
    export default class OrganizationRoleList extends Vue {
        public get headers(): object[] {
            return [
                {   text: this.$mfl('role', 'label'),
                    align: 'left',
                    value: 'label',
                },
                {   text: this.$mfl('role', 'name'),
                    align: 'left',
                    value: 'name',
                },
            ];
        }

        public metaInfo(): MetaInfo {
            return {
                title: this.$mpl('role'),
            };
        }

        public async fetchRequest(event: FetchRequestDataListEvent): Promise<ListResponse> {
            return await this.$api.requestList({
                method: 'GET',
                url: '/{organization}/roles',
                limit: event.limit,
                page: event.page,
                search: event.search || undefined,
                sort: event.sort,
                filter: event.filters || undefined,
                fields: [
                    'id',
                    'role.label',
                    'role.name',
                ],
            }, event.canceler);
        }
    }
</script>
