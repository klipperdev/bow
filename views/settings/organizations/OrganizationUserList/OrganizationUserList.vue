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
