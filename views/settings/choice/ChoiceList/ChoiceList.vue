<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./ChoiceList.ts" />

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
        >
            <template v-slot:header-actions>
                <k-standard-header-button
                    icon="add"
                    :to="{name: 'settings-choice', params: {id: 'create'}}"
                />
            </template>

            <template v-slot:data-table.item.label="{item}">
                <router-link
                    class="font-weight-bold"
                    :to="{name: 'settings-choice', params: {org: $org, id: item.id}}"
                >
                    {{ $oc(item).label() }}
                </router-link>
            </template>

            <template v-slot:data-table.item.updated_at="{item}">
                {{ $datetime($oc(item).updated_at()) }}
            </template>
        </k-standard-data-list>
    </v-container>
</template>
