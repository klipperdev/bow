<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KDataList.ts" />

<style lang="scss" src="./KDataList.scss" />

<template>
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
                    :message="previousError ? errorMessage : undefined"
                    class="mt-n3 mb-n3"
                />
            </slot>
        </template>
    </k-wall-message>

    <div
        v-else
    >
        <v-col
            class="pt-0 pb-0"
        >
            <v-row
                align="center"
                class="flex-column flex-sm-row"
            >
                <v-col
                    class="flex-grow-1"
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
                    class="k-data-list__actions flex-grow-0 flex-shrink-1 justify-start"
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

                    <k-standard-header-button
                        icon="refresh"
                        color="secondary"
                        outlined
                        :loading="loading"
                        @click="refresh"
                    />
                </v-col>
            </v-row>
        </v-col>

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
                <template v-slot:body.prepend="{headers}">
                    <tr v-if="previousError">
                        <td :colspan="headers.length">
                            <v-alert
                                class="mt-1 mb-1"
                                color="error"
                                dark
                                dense
                                dismissible
                                @input="onToggleAlert"
                            >
                                <v-icon
                                    dark
                                    size="26"
                                    class="mr-3 mt-n1"
                                >
                                    warning
                                </v-icon>

                                {{ errorMessage }}
                            </v-alert>
                        </td>
                    </tr>
                </template>

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
</template>
