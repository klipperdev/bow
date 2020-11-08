<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KSnackbar.ts" />

<template>
    <v-snackbar
        v-model="show"
        bottom
        right
        :rounded="multiLine ? false : 'pill'"
        :multi-line="multiLine"
        :timeout="timeout"
        :color="color"
    >
        <span
            v-html="message"
        ></span>

        <template
            v-slot:action="{attrs}"
        >
            <v-btn
                v-if="showCloseButton"
                text
                dark
                ripple
                rounded
                :fab="0 === items.length"
                small
                v-bind="attrs"
                @click="show = false"
            >
                <span
                    v-if="items.length > 0"
                >
                    {{ $t('next.count', {count: items.length}) }}
                </span>

                <v-icon
                    v-else
                    small
                >
                    close
                </v-icon>
            </v-btn>
        </template>
    </v-snackbar>
</template>
