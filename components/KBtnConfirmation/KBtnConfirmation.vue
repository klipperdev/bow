<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KBtnConfirmation.ts" />

<template>
    <v-btn
        :id="'btn_confirmation_' + self._uid"
        v-bind="genButtonProps"
        v-on="$listeners"
    >
        <slot
            name="default"
        />

        <v-dialog
            :activator="'#btn_confirmation_' + self._uid"
            v-model="dialog"
            persistent
            :max-width="dialogMaxWidth"
            class="v-btn"
            content-class="scroller-theme--dark"
            transition=""
        >
            <v-card>
                <v-card-title
                    :class="self.$classes('primary--text', 'text--lighten-2')"
                >
                    <slot
                        name="title"
                    >
                        {{ dialogTitle ? dialogTitle : $t('confirmation.title') }}
                    </slot>
                </v-card-title>

                <v-card-text
                    class="pt-4"
                >
                    <slot
                        name="text"
                    >
                        {{ dialogMessage ? dialogMessage : $t('confirmation.text') }}
                    </slot>
                </v-card-text>

                <v-card-actions>
                    <v-spacer />

                    <v-btn
                        text
                        ripple
                        :disabled="loading"
                        @click="dialog = false"
                    >
                        {{ $t('cancel') }}
                    </v-btn>

                    <v-btn
                        :color="dialogButtonColor"
                        depressed
                        ripple
                        :loading="loading"
                        :disabled="loading"
                        @click="confirmAction"
                    >
                        {{ dialogButtonTitle ? dialogButtonTitle : $t('confirm') }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-btn>
</template>
