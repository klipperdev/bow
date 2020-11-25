<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KStandardDataList.ts" />

<template>
    <k-data-list
        ref="dataList"
        v-bind="genDataListProps"
        v-on="$listeners"
    >
        <template v-slot:prepend="props">
            <k-standard-header v-if="header">
                <template v-slot:header>
                    <k-list-view
                        v-if="genListView && !!$refs.dataList && !!$refs.dataList.metadata"
                        :type="$refs.dataList.metadata"
                        :route-query="$refs.dataList.routeQuery"
                        :route-query-prefix="$refs.dataList.routeQueryPrefix"
                        @change="$refs.dataList.refreshToFirstPage()"
                    />

                    <k-standard-view-title-icon
                        v-if="!!icon"
                        :icon="icon"
                        :icon-size="24"
                        color="accent"
                    />

                    <k-standard-view-title
                        v-if="!!title"
                        :title="title"
                        disable-loading
                        flex-grow=""
                    />

                    <v-chip
                        v-if="null !== props.total"
                        small
                        outlined
                        class="ml-2"
                    >
                        {{ $number(props.total, 0) }}
                    </v-chip>
                </template>

                <template v-slot:actions>
                    <slot
                        name="header-actions"
                        v-bind="props"
                    />

                    <k-standard-header-button
                        icon="refresh"
                        color="primary"
                        outlined
                        :loading="props.loading"
                        @click="props.refresh"
                    />
                </template>
            </k-standard-header>
        </template>

        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
            <slot :name="slotItem.original" v-bind="props"/>
        </template>
    </k-data-list>
</template>
