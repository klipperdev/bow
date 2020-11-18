<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./OrganizationUserList.ts" />

<template>
    <v-container
        fluid
    >
        <k-data-list
            ref="dataList"
            :headers="headers"
            :fetch-request="fetchRequest"
            large
            no-result-large
            metadata="organization_user"
            route-query
        >
            <template v-slot:header="{total}">
                <v-subheader
                    :class="$classes('pl-0 mt-4 mb-4 primary--text', 'text--lighten-3')"
                >
                    <k-list-view
                        v-if="!!$refs.dataList"
                        type="organization_user"
                        :route-query="$refs.dataList.routeQuery"
                        :route-query-prefix="$refs.dataList.routeQueryPrefix"
                        @change="$refs.dataList.refresh"
                    />

                    <v-chip
                        v-if="null !== total"
                        class="ml-2"
                        small
                        outlined
                    >
                        {{ $number(total, 0) }}
                    </v-chip>
                </v-subheader>
            </template>

            <template v-slot:header-actions>
                <k-standard-data-list-button
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
                    :to="{name: 'settings-org-user', params: {org: $org, id: item.id}}"
                >
                    {{ $oc(item).user.full_name($oc(item).user.username()) }}
                </router-link>
            </template>

            <template v-slot:data-table.item.enabled="{item}">
                <k-checkbox :value="item.enabled"/>
            </template>

            <template v-slot:data-table.item.updated_at="{item}">
                {{ $datetime(item.updated_at) }}
            </template>
        </k-data-list>
    </v-container>
</template>
