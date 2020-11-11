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
        <template v-slot:header="{total}">
            <div
                class="d-flex align-center mt-4 mb-4"
            >
                <k-list-view
                    v-if="genShowListView && !!$refs.dataList && !!$refs.dataList.metadata"
                    :type="$refs.dataList.metadata"
                    :route-query="$refs.dataList.routeQuery"
                    :route-query-prefix="$refs.dataList.routeQueryPrefix"
                    @change="$refs.dataList.refreshToFirstPage()"
                >
                </k-list-view>

                <v-icon
                    v-if="!!icon"
                    class="mr-3"
                    :color="$color('primary', 'primary lighten-3')"
                >
                    {{ icon }}
                </v-icon>

                <span
                    v-if="!!title"
                    :class="$classes('text-h6')"
                >
                    {{ title }}
                </span>

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
            </div>
        </template>

        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
            <slot :name="slotItem.original" v-bind="props"/>
        </template>
    </k-data-list>
</template>
