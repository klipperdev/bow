<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KDataKanban.ts" />

<template>
    <k-kanban
        ref="kanban"
        v-bind="$attrs"
        v-on="$listeners"
    >
        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
            <slot :name="slotItem.original" v-bind="getSlotProps(props)"/>
        </template>
    </k-kanban>
</template>
