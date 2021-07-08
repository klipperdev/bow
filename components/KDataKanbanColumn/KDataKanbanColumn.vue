<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KDataKanbanColumn.ts" />

<style lang="scss" src="./KDataKanbanColumn.scss" />

<template>
    <k-kanban-column
        ref="column"
        v-bind="$attrs"
        v-on="$listeners"
    >
        <template v-slot:header-actions-append="props">
            <v-progress-linear
                indeterminate
                rounded
                absolute
                bottom
                class="mb-2"
                :active="loading"
            />

            <slot
                name="header-actions-append"
                v-bind="props"
            />
        </template>

        <template v-slot:header-title-append-inner>
            <v-chip
                small
                class="ml-2"
            >
                {{ $number(total, 0) }}
            </v-chip>
        </template>

        <template v-slot:footer="props">
            <slot
                name="footer"
                v-bind="props"
            />

            <v-fade-transition
                mode="out-in"
            >
                <div
                    v-if="hasPagination"
                    class="k-data-kanban-column-pagination pt-1"
                >
                    <v-btn
                        small
                        rounded
                        ripple
                        icon
                        @click="previousPage" :disabled="page <= 1"
                    >
                        <v-icon
                            small
                        >
                            chevron_left
                        </v-icon>
                    </v-btn>

                    <v-fade-transition
                        mode="out-in"
                    >
                        <span
                            :key="page"
                            class="ml-2 text-caption text-secondary"
                        >
                            {{ page }}
                        </span>
                    </v-fade-transition>

                    <span
                        class="ml-2 mr-2 text-caption text-secondary"
                    >
                        /
                    </span>

                    <span
                        class="mr-2 text-caption text-secondary"
                    >
                        {{ pages > 0 ? pages : 1 }}
                    </span>

                    <v-btn
                        small
                        rounded
                        ripple
                        icon
                        @click="nextPage" :disabled="page >= pages"
                    >
                        <v-icon
                            small
                        >
                            chevron_right
                        </v-icon>
                    </v-btn>
                </div>
            </v-fade-transition>
        </template>

        <template v-slot:default="props">
            <slot
                name="default"
                v-bind="getSlotProps(props)"
            >
                <v-data-iterator
                    :items="items"
                    :items-per-page.sync="limit"
                    :page.sync="page"
                    :loading="loading"
                    :search="search"
                    :item-key="kanbanData.itemKey"
                    hide-default-footer
                    class="d-flex flex-column flex-shrink-1"
                >
                    <template v-slot:loading>
                        <slot name="items.loading" v-bind="getSlotProps({})">
                            <k-kanban-card>
                                <k-loading/>
                            </k-kanban-card>
                        </slot>
                    </template>

                    <template v-slot:no-data>
                        <slot name="items.no-results" v-bind="getSlotProps({})">
                            <k-kanban-card>
                                <v-card-text class="text-align-center py-6">
                                    {{ $t('no-result') }}
                                </v-card-text>
                            </k-kanban-card>
                        </slot>
                    </template>

                    <template v-slot:no-results>
                        <slot name="items.no-results" v-bind="getSlotProps({})">
                            <k-kanban-card>
                                <v-card-text class="text-align-center py-6">
                                    {{ $t('no-result') }}
                                </v-card-text>
                            </k-kanban-card>
                        </slot>
                    </template>

                    <template v-slot:item="props">
                        <slot name="items.item" v-bind="getSlotProps(props)"/>
                    </template>

                    <template v-slot:header="props">
                        <slot name="items.header" v-bind="getSlotProps(props)"/>
                    </template>

                    <template v-slot:footer="props">
                        <slot name="items.footer" v-bind="getSlotProps(props)"/>
                    </template>

                    <template v-slot:footer.page-text="props">
                        <slot name="items.footer.page-text" v-bind="getSlotProps(props)"/>
                    </template>

                    <template v-slot:default="props">
                        <slot name="items" v-bind="getSlotProps(props)">
                            <slot
                                v-for="item in items"
                                name="item"
                                v-bind="getSlotProps({item})"
                            />
                        </slot>
                    </template>
                </v-data-iterator>
            </slot>
        </template>

        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
            <slot :name="slotItem.original" v-bind="props"/>
        </template>
    </k-kanban-column>
</template>
