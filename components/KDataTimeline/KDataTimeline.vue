<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KDataTimeline.ts" />

<style lang="scss" src="./KDataTimeline.scss" />

<template>
    <div class="k-data-timeline">
        <slot
            name="prepend"
            v-bind="genSlotProps"
        />

        <v-card class="flex-column">
            <v-fade-transition>
                <v-progress-linear
                    v-if="loading"
                    indeterminate
                    absolute
                />
            </v-fade-transition>

            <k-loading
                v-if="loading && -1 === pages"
                :size="28"
                :width="3"
            />

            <v-timeline
                v-else
                v-bind="genProps"
                v-on="$listeners"
                align-top
                dense
            >
                <v-timeline-item v-for="item in items" :key="getItemKey(item)">
                    <template v-slot:default>
                        <slot
                            name="item"
                            v-bind="getItemSlotProps(item)"
                        />
                    </template>

                    <template v-slot:icon>
                        <slot
                            name="item.icon"
                            v-bind="getItemSlotProps(item)"
                        />
                    </template>

                    <template v-slot:opposite>
                        <slot
                            name="item.opposite"
                            v-bind="getItemSlotProps(item)"
                        />
                    </template>
                </v-timeline-item>

                <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
                    <slot :name="slotItem.original" v-bind="props"/>
                </template>

                <v-fade-transition mode="out-in">
                    <div
                        v-if="hasPagination"
                        class="k-data-timeline--pagination d-flex align-center pa-1"
                    >
                        <v-spacer/>

                        <v-btn
                            small
                            rounded
                            ripple
                            icon
                            @click="previousPage" :disabled="page <= 1"
                        >
                            <v-icon>
                                chevron_left
                            </v-icon>
                        </v-btn>

                        <span class="ml-2 text-caption text--secondary">
                            {{ page }}
                        </span>

                        <span class="mx-2 text-caption text--secondary">/</span>

                        <span class="mr-2 text-caption text--secondary">
                            {{ pages > 0 ? pages : 1 }}
                        </span>

                        <v-btn
                            small
                            rounded
                            ripple
                            icon
                            @click="nextPage" :disabled="page >= pages"
                        >
                            <v-icon>
                                chevron_right
                            </v-icon>
                        </v-btn>

                        <v-spacer/>
                    </div>
                </v-fade-transition>
            </v-timeline>
        </v-card>

        <slot
            name="append"
            v-bind="genSlotProps"
        />
    </div>
</template>
