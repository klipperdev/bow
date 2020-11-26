<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KDeleteAction.ts" />

<template>
    <v-btn
        :id="'deleteAction_' + _uid"
        :color="color"
        :class="classes"
        :ripple="ripple"
        :rounded="rounded"
        :depressed="depressed"
        :outlined="outlined"
        :text="text"
        :icon="icon"
        :disabled="disabled"
        :small="small"
    >
        <slot
            name="btn-icon"
        >
            <v-icon
                :small="small"
            >
                delete
            </v-icon>
        </slot>

        <v-dialog
            :activator="'#deleteAction_' + _uid"
            v-model="dialog"
            persistent
            :max-width="maxWidth"
            class="v-btn"
            content-class="scroller-theme--dark"
            transition=""
        >
            <v-card>
                <v-card-title
                    :class="$classes('primary--text', 'text--lighten-2')"
                >
                    <slot
                        name="title"
                    >
                        {{ title ? title : $t('delete.confirmation.title') }}
                    </slot>
                </v-card-title>

                <v-card-text
                    class="pt-4"
                >
                    <slot
                        name="text"
                    >
                        {{ message ? message : $t('delete.confirmation.text') }}
                    </slot>
                </v-card-text>

                <v-card-actions>
                    <v-spacer />

                    <v-btn
                        text
                        rounded
                        ripple
                        color="primary"
                        :disabled="loading"
                        @click="dialog = false"
                    >
                        {{ $t('cancel') }}
                    </v-btn>

                    <v-btn
                        color="error"
                        depressed
                        rounded
                        ripple
                        :loading="loading"
                        :disabled="loading"
                        @click="deleteAction"
                    >
                        {{ $t('delete') }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-btn>
</template>
