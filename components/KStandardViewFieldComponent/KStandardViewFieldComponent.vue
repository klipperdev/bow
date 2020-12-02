<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KStandardViewFieldComponent.ts" />

<template>
    <k-col-label
        v-bind="genColLabelProps"
        v-on="genColLabelListeners"
    >
        <template v-slot:read>
            <slot
                name="read"
                v-bind="genViewProps"
                v-on="genViewListeners"
                :value="fieldValue"
                :default-value="defaultValue"
            />

            <slot
                name="default"
                v-bind="genViewProps"
                v-on="genViewListeners"
                :value="fieldValue"
                :default-value="defaultValue"
            />
        </template>

        <template v-slot:edit>
            <slot
                name="edit"
                v-model="fieldValue"
                v-bind="genEditProps"
                v-on="genEditListeners"
            />
        </template>

        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
            <slot :name="slotItem.original" v-bind="props"/>
        </template>
    </k-col-label>
</template>
