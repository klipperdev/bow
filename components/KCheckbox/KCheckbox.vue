<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KCheckbox.ts" />

<template>
    <v-icon
        v-bind="genProps"
        v-on="$listeners"
    >
        <slot name="default">
            {{ genIcon }}
        </slot>
    </v-icon>
</template>
