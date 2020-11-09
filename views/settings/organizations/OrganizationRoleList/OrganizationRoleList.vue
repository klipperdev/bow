<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./OrganizationRoleList.ts" />

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
            metadata="role"
            route-query
        >
            <template v-slot:header="{total}">
                <v-subheader
                    :class="$classes('pl-0 mt-4 mb-4 primary--text', 'text--lighten-3')"
                >
                    <k-list-view
                        v-if="!!$refs.dataList"
                        type="role"
                        :route-query="$refs.dataList.routeQuery"
                        :route-query-prefix="$refs.dataList.routeQueryPrefix"
                        @change="$refs.dataList.refresh"
                    />

                    <v-fade-transition
                        mode="out-in"
                    >
                        <v-chip
                            v-if="null !== total"
                            small
                            outlined
                            class="ml-2"
                        >
                            {{ $number(total, 0) }}
                        </v-chip>
                    </v-fade-transition>
                </v-subheader>
            </template>

            <template v-slot:header-actions>
                <k-standard-data-list-button
                    icon="add"
                    :to="{name: 'settings-org-role', params: {id: 'create'}}"
                />
            </template>

            <template v-slot:data-table.item.label="{item}">
                <router-link
                    class="font-weight-bold"
                    :to="{name: 'settings-org-role', params: {org: $org, id: item.id}}"
                >
                    {{ $oc(item).label() }}
                </router-link>
            </template>

            <template v-slot:data-table.item.name="{item}">
                {{ $oc(item).name() }}
            </template>
        </k-data-list>
    </v-container>
</template>
