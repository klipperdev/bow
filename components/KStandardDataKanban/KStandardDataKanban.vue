<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KStandardDataKanban.ts" />

<template>
    <k-data-kanban
        ref="dataKanban"
        v-bind="genDataKanbanProps"
        v-on="$listeners"
    >
        <template v-slot:prepend="kanbanProps">
            <k-standard-header
                v-if="initialized && header"
                class="flex-grow-0"
            >
                <template v-slot:header>
                    <slot name="header-prepend" v-bind="kanbanProps"/>

                    <k-list-view
                        v-if="genListView"
                        :type="metadata"
                        :route-query="$refs.dataKanban.routeQuery"
                        :route-query-prefix="$refs.dataKanban.routeQueryPrefix"
                        @change="$refs.dataKanban.refreshToFirstPage"
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
                        v-if="null !== kanbanProps.total && undefined !== kanbanProps.total && (!!genListView || !!title)"
                        small
                        outlined
                        class="ml-2"
                    >
                        {{ $number(kanbanProps.total, 0) }}
                    </v-chip>

                    <k-query-builder
                        v-if="genQueryBuilder && !!$refs.dataKanban && !!metadata"
                        class="ml-2"
                        :type="metadata"
                        :route-query="$refs.dataKanban.routeQuery"
                        :route-query-prefix="$refs.dataKanban.routeQueryPrefix"
                        :filter-transformer="queryBuilderTransformer"
                        @change="$refs.dataKanban.refreshToFirstPage"
                    >
                        <template v-for="slotItem in getSlotItems('query-builder')" v-slot:[slotItem.target]="props">
                            <slot :name="slotItem.original" v-bind="props"/>
                        </template>
                    </k-query-builder>
                </template>

                <template v-slot:actions>
                    <slot
                        name="header-actions-prepend"
                        v-bind="kanbanProps"
                    />

                    <k-standard-header-button
                        icon="refresh"
                        color="primary"
                        text
                        :loading="kanbanProps.loading"
                        @click="kanbanProps.refresh"
                    />

                    <slot
                        name="header-actions-append-refresh"
                        v-bind="kanbanProps"
                    />

                    <slot
                        v-if="$refs.dataKanban && !!metadata"
                        name="header-export-actions"
                        :isExportAvailable="isExportAvailable"
                        :metadata="metadata"
                        :filter="$refs.dataKanban.requestFilters"
                        :search="kanbanProps.search"
                        :fields="exportFields"
                    >
                        <k-standard-header-button-export
                            v-if="isExportAvailable"
                            :metadata="metadata"
                            :filter="$refs.dataKanban.requestFilters"
                            :search="kanbanProps.search"
                            :fields="exportFields"
                        />
                    </slot>

                    <slot
                        v-if="$refs.dataKanban && !!metadata"
                        name="header-import-actions"
                        :isImportAvailable="isImportAvailable"
                        :metadata="metadata"
                    >
                        <k-standard-header-button-import
                            v-if="isImportAvailable"
                            :metadata="metadata"
                        />
                    </slot>

                    <slot
                        name="header-actions"
                        v-bind="kanbanProps"
                    />
                </template>
            </k-standard-header>
        </template>

        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
            <slot :name="slotItem.original" v-bind="props"/>
        </template>
    </k-data-kanban>
</template>
