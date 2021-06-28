<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KTabbedStandardViewTab.ts" />

<template>
    <v-tab-item
        v-if="!standardData.isCreate || (isCreatable)"
        v-bind="genProps"
        v-on="$listeners"
    >
        <slot
            v-if="noContainer"
            name="default"
        />

        <v-container
            v-else
            v-bind="genContainerProps"
        >
            <slot name="default"/>
        </v-container>
    </v-tab-item>
</template>
