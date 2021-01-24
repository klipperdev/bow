<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KLinkAssociation.ts" />

<template>
    <v-chip
        v-if="chip"
        v-bind="genChipProps"
    >
        <slot name="prepend"/>
        <k-text :value="genLabel"/>
        <slot name="append"/>
    </v-chip>

    <router-link
        v-else-if="!!genTo"
        v-bind="$attrs"
        v-on="$listeners"
        :to="genTo"
    >
        <slot name="prepend"/>
        <k-text :value="genLabel"/>
        <slot name="append"/>
    </router-link>

    <k-text
        v-else
        v-bind="$attrs"
        v-on="$listeners"
        :value="genLabel"
    />
</template>
