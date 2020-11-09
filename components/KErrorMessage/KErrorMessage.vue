<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KErrorMessage.ts" />

<template>
    <v-row
        align="center"
        justify="center"
    >
        <k-wall-message
            :message="message"
        >
            <template v-slot:icon>
                <k-lottie
                    center
                    width="90%"
                    :max-width="iconSize"
                    :options="{animationData: iconData, loop: true}"
                ></k-lottie>
            </template>

            <template v-slot:default>
                <slot name="default"/>
            </template>
        </k-wall-message>
    </v-row>
</template>
