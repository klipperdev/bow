<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KChoiceChip.ts" />

<template>
    <v-chip
        v-if="!!choice"
        :color="$oc(choice).color(genDefaultColor)"
        dark
        v-bind="$attrs"
        v-on="$listeners"
    >
        <slot
            name="default"
            v-bind="genSlotProps"
        >
            {{ genLabel }}
        </slot>
    </v-chip>

    <span
        v-else
    >
        {{ defaultLabel }}
    </span>
</template>
