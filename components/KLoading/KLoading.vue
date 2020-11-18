<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KLoading.ts" />

<template>
    <v-dialog
        v-if="fullscreen"
        v-model="value"
        persistent
        fullscreen
        hide-overlay
        transition=""
    >
        <v-card
            class="fill-height"
        >
            <v-container
                fluid
                fill-height
            >
                <v-row
                    no-gutters
                    align="center"
                    justify="center"
                >
                    <v-progress-circular
                        indeterminate
                        :size="size"
                        :width="width"
                        :color="progressColor"
                    />

                    <h1
                        v-if="message != null">
                        {{message}}
                    </h1>
                </v-row>
            </v-container>
        </v-card>
    </v-dialog>

    <v-container
        v-else
        fill-height
    >
        <v-row
            no-gutters
            align="center"
            justify="center"
        >
            <v-progress-circular
                indeterminate
                :size="size"
                :width="width"
                :color="progressColor"
            />

            <h1 v-if="message != null"
            >
                {{message}}
            </h1>
        </v-row>
    </v-container>
</template>
