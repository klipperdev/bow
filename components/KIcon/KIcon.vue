<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KIcon.ts" />

<template>
    <v-icon
        v-if="!!value"
        v-bind="genProps"
        v-on="$listeners"
    >
        <slot name="default">
            {{ value || defaultValue }}
        </slot>
    </v-icon>

    <k-text
        v-else
        :value="defaultValue"
    />
</template>
