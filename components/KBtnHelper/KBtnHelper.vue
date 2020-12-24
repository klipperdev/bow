<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KBtnHelper.ts" />

<template>
    <v-btn
        v-bind="$attrs"
        v-on="$listeners"
        small
        icon
        text
        class="ml-2 mt-n1"
        :color="color"
    >
        <v-icon small>
            {{ icon }}
        </v-icon>
    </v-btn>
</template>
