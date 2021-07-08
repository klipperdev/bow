<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KKanbanCard.ts" />

<style lang="scss" src="./KKanbanCard.scss" />

<template>
    <v-card
        ref="card"
        class="k-kanban-card"
        v-bind="$attrs"
        v-on="$listeners"
    >
        <template v-slot:loading>
            <slot name="loading"/>
        </template>

        <template v-slot:default>
            <slot name="default"/>
        </template>
    </v-card>
</template>
