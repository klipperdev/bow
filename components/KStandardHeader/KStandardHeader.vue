<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KStandardHeader.ts" />

<style lang="scss" src="./KStandardHeader.scss" />

<template>
    <v-row
        v-bind="$attrs"
        v-on="$listeners"
        no-gutters
        class="k-standard-header mb-2"
    >
        <v-col class="k-standard-header--title py-0 d-flex align-center flex-grow-1">
            <slot name="header"/>
            <slot name="default"/>
        </v-col>

        <v-col
            v-if="$scopedSlots.actions"
            class="k-standard-header--actions py-0 d-flex align-center flex-grow-0 flex-shrink-1 text-right"
        >
            <slot name="actions"/>
        </v-col>
    </v-row>
</template>
