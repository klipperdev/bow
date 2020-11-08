<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KSearchField.ts" />

<template>
    <v-text-field
        flat
        solo-inverted
        hide-details
        clearable
        prepend-inner-icon="search"
        :label="$t('search')"
        v-model="search"
        color="accent lighten-2"
        rounded
    ></v-text-field>
</template>
