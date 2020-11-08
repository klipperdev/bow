<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KStandardViewButton.ts" />

<template>
    <v-btn v-bind="genButtonProps" v-on="$listeners">
        <v-icon>
            <slot name="default">{{ icon }}</slot>
        </v-icon>
    </v-btn>
</template>
