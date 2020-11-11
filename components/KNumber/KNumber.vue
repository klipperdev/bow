<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KNumber.ts" />

<template>
    <v-text-field
        v-bind="textAttrs"
        v-on="textListeners"
        v-model="formattedValue"
        @change="onChange"
    >
        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]>
            <slot :name="slotItem.original"/>
        </template>
    </v-text-field>
</template>
