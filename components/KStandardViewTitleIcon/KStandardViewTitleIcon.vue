<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KStandardViewTitleIcon.ts" />

<template>
    <v-icon
        v-bind="$attrs"
        v-on="$listeners"
        class="mr-2"
        :style="genStyle"
        :size="genIconSize"
        :color="color"
    >
        {{ icon }}
    </v-icon>
</template>
