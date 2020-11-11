<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KDataList.ts" />

<style lang="scss" src="./KDataList.scss" />

<template>
    <v-fade-transition
        mode="out-in"
    >
        <k-loading
            v-if="firstLoader && firstLoading"
            class="mt-5"
        />

        <k-wall-message
            v-else-if="firstLoader && wallEmptyMessage && hasNoItems"
        >
            <template v-for="slotItem in getSlotItems('no-items')" v-slot:[slotItem.target]>
                <slot :name="slotItem.original">
                    <k-no-result-message
                        :dense="!noResultLarge"
                        class="mt-n3 mb-n3"
                    />
                </slot>
            </template>
        </k-wall-message>

        <div
            v-else
        >
            <v-row
                class="ma-0"
                align="center"
            >
                <v-col
                    class="flex-grow-1 ma-0 pa-0"
                >
                    <slot
                        name="header"
                        :headers="headers"
                        :items="items"
                        :page="page"
                        :limit="limit"
                        :pages="pages"
                        :total="total"
                        :search="search"
                    />
                </v-col>

                <v-col
                    class="k-data-list__actions flex-grow-0 flex-shrink-1"
                >
                    <slot
                        name="header-actions"
                        :headers="headers"
                        :items="items"
                        :page="page"
                        :limit="limit"
                        :pages="pages"
                        :total="total"
                        :search="search"
                    />

                    <k-standard-data-list-button
                        icon="refresh"
                        :color="$color('primary', 'primary lighten-2')"
                        :loading="loading"
                        @click="refresh"
                    />
                </v-col>
            </v-row>

            <v-card>
                <v-data-table
                    v-bind="genTableProps"
                    :headers="headers"
                    :items="items"
                    :item-class="itemClass"
                    :loading="loading"
                    :loader-height="2"
                    :disable-sort="!isSortable"
                    :server-items-length="total"
                    :show-select="showSelect"
                    :single-select="singleSelect"
                    :search="search"
                    :options.sync="tableOptions"
                    :item-key="itemKey"
                    :footer-props="{
                        'items-per-page-options': itemsPerPage,
                    }"
                    @update:options="onUpdatedOptions"
                >
                    <template v-slot:no-data>
                        <slot name="no-items">
                            <k-no-result-message
                                :dense="!noResultLarge"
                                class="mt-n3 mb-n3"
                            />
                        </slot>
                    </template>

                    <template v-slot:loading>
                        <slot name="loading">
                            <k-loading
                                :size="28"
                                :width="3"
                                class="mt-n3 mb-n3"
                            />
                        </slot>
                    </template>

                    <template v-for="slotItem in getSlotItems('data-table')" v-slot:[slotItem.target]="props">
                        <slot :name="slotItem.original" v-bind="props"/>
                    </template>
                </v-data-table>
            </v-card>
        </div>
    </v-fade-transition>
</template>
