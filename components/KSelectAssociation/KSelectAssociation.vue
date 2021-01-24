<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KSelectAssociation.ts"/>

<template>
    <v-select
        v-if="!autocomplete"
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
                color="primary"
            />

            <k-menu-pagination
                v-if="paginationPages > 1"
                :page="page"
                :limit="limit"
                :pages="paginationPages"
                :total="paginationTotal"
                @previous="previousPage"
                @next="nextPage"
            />

            <v-progress-linear
                v-if="loading"
                indeterminate
                absolute
                color="primary"
                :height="$attrs['loader-height'] || 2"
            />
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
            />
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

            <slot
                v-else
                name="no-data-content"
                v-bind="selectNoDataContentAttrs"
            >
                <k-no-result-message
                    dense
                />
            </slot>
        </template>

        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
            <slot :name="slotItem.original" v-bind="props"/>
        </template>

        <template v-slot:append><slot name="append"/></template>
        <template v-slot:append-outer><slot name="append-outer"/></template>
        <template v-slot:prepend><slot name="prepend"/></template>
        <template v-slot:prepend-inner><slot name="prepend-inner"/></template>
    </v-select>

    <v-autocomplete
        v-else
        ref="select"
        v-bind="selectAttrs"
        v-on="selectListeners"
    >
        <template v-slot:prepend-item>
            <k-menu-pagination
                v-if="paginationPages > 1"
                :page="page"
                :limit="limit"
                :pages="paginationPages"
                :total="paginationTotal"
                @previous="previousPage"
                @next="nextPage"
            />

            <v-progress-linear
                v-if="loading"
                indeterminate
                absolute
                color="primary"
                :height="$attrs['loader-height'] || 2"
            />
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
            />
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

            <slot
                v-else
                name="no-data-content"
                v-bind="selectNoDataContentAttrs"
            >
                <k-no-result-message
                    dense
                />
            </slot>
        </template>

        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
            <slot :name="slotItem.original" v-bind="props"/>
        </template>

        <template v-slot:append><slot name="append"/></template>
        <template v-slot:append-outer><slot name="append-outer"/></template>
        <template v-slot:prepend><slot name="prepend"/></template>
        <template v-slot:prepend-inner><slot name="prepend-inner"/></template>
    </v-autocomplete>
</template>
