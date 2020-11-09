<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KIconMessage.ts" />

<template>
    <v-row
        align="center"
        justify="center"
    >
        <k-wall-message
            :message="message"
        >
            <template v-slot:icon>
                <v-icon
                    :size="iconSize"
                    :color="iconColor"
                >
                    {{ icon }}
                </v-icon>
            </template>

            <template v-slot:default>
                <slot name="default"/>
            </template>
        </k-wall-message>
    </v-row>
</template>
