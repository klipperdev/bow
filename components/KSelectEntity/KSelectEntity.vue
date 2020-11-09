<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KSelectEntity.ts"/>

<template>
    <v-select
        ref="select"
        v-bind="selectAttrs"
        v-on="$listeners"
    >
        <template v-slot:prepend-item>
            <v-text-field
                v-model="search"
                full-width
                hide-details
                :label="$t('search')"
                prepend-inner-icon="search"
                single-line
                solo
                flat
                clearable
                dense
                autofocus
                autocomplete="off"
                color="accent"
            ></v-text-field>

            <k-menu-pagination
                v-if="paginationPages > 1"
                :page="page"
                :limit="limit"
                :pages="paginationPages"
                :total="paginationTotal"
                @previous="previousPage"
                @next="nextPage"
            ></k-menu-pagination>

            <v-progress-linear
                v-if="loading"
                indeterminate
                absolute
                color="accent"
                :height="$attrs['loader-height'] || 2"
            ></v-progress-linear>
        </template>

        <template v-slot:append-item>
            <k-menu-pagination
                v-if="paginationPages > 1"
                :page="page"
                :limit="limit"
                :pages="paginationPages"
                :total="paginationTotal"
                @previous="previousPage"
                @next="nextPage"
            ></k-menu-pagination>
        </template>

        <template v-slot:no-data>
            <v-list
                v-if="loading"
            >
                <v-list-item>
                    <k-loading
                        class="mt-1"
                        progress-color=""
                    ></k-loading>
                </v-list-item>
            </v-list>

            <k-no-result-message
                v-else
                dense
            ></k-no-result-message>
        </template>

        <template v-for="slotItem of $findScopedSlots($scopedSlots, '')" v-slot:[slotItem.target]="scope">
            <slot
                :name="slotItem.original"
                v-bind="scope"
            />
        </template>
    </v-select>
</template>
