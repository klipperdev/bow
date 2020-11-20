<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./SettingsToolbarExtension.ts" />

<template>
    <span
        v-if="!!genToolbarTitle"
        class="ml-15 text-subtitle-1 text--secondary"
    >
        {{ genToolbarTitle }}
    </span>

    <v-tabs
        v-else
        v-model="tab"
        ref="settingsTabs"
        align-with-title
        show-arrows
        :color="$store.state.darkMode.enabled ? 'primary lighten-2' : 'primary'"
    >
        <v-tab
            v-for="item in items"
            :key="item.name"
            :to="item.to"
        >
            {{ item.label }}
        </v-tab>
    </v-tabs>
</template>
