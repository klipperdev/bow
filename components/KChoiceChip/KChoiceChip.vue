<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KChoiceChip.ts" />

<template>
    <v-chip
        :color="$oc(choice).color(genDefaultColor)"
        dark
        v-bind="$attrs"
        v-on="$listeners"
    >
        {{ $oc(choice).label(defaultLabel) }}
    </v-chip>
</template>
