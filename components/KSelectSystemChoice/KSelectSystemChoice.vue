<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KSelectSystemChoice.ts" />

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
        </template>

        <template v-slot:no-data>
            <k-no-result-message
                dense
            />
        </template>

        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]>
            <slot :name="slotItem.original"/>
        </template>
    </v-select>
</template>
