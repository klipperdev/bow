<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KStandardDataListButton.ts" />

<template>
    <v-btn
        v-bind="genButtonProps"
        v-on="$listeners"
    >
        <v-icon
            small
        >
            <slot name="default">
                {{ icon }}
            </slot>
        </v-icon>
    </v-btn>
</template>
