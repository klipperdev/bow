<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./ChangePassword.ts" />

<template>
    <v-btn
        v-bind="$attrs"
        v-on="$listeners"
        :id="'changePassword_' + _uid"
        :color="$color('primary', 'primary lighten-2')"
        depressed
        ripple
        rounded
        small
        :loading="loading"
    >
        <slot
            name="btn-content"
        >
            {{ $t('views.settings-organization-user.change-password') }}
        </slot>

        <v-dialog
            eager
            :activator="'#changePassword_' + _uid"
            v-model="dialog"
            persistent
            :max-width="maxWidth"
            class="v-btn"
            content-class="scroller-theme--dark"
        >
            <v-form
                ref="form"
                @submit.prevent=""
            >
                <v-card>
                    <v-card-title
                        :class="$classes('primary--text', 'text--lighten-3')"
                    >
                        <slot
                            name="title"
                        >
                            {{ $t('views.settings-organization-user.change-password') }}
                        </slot>
                    </v-card-title>

                    <k-form-alert
                        :http-error="previousError"
                    />

                    <v-container>
                        <v-row>
                            <k-col-label
                                :colProps="{sm: 12}"
                                vertical
                                :label="$t('views.settings-organization-user.new-password')"
                            >
                                <v-text-field
                                    type="text"
                                    filled
                                    autofocus
                                    autocomplete='off'
                                    v-model="newPassword"
                                    :error-messages="fieldErrors('new_password')"
                                    :disabled="loading"
                                    :append-icon="showNewPassword ? 'visibility_off' : 'visibility'"
                                    :type="showNewPassword ? 'text' : 'password'"
                                    :rules="[$r('required')]"
                                    @keydown.enter="save"
                                    @click:append="showNewPassword = !showNewPassword"
                                />
                            </k-col-label>
                        </v-row>
                    </v-container>

                    <v-card-actions>
                        <v-spacer/>

                        <v-btn
                            text
                            ripple
                            :disabled="loading"
                            @click="dialog = false"
                        >
                            {{ $t('cancel') }}
                        </v-btn>

                        <v-btn
                            color="accent"
                            depressed
                            ripple
                            :loading="loading"
                            :disabled="loading"
                            @click="save"
                        >
                            {{ $t('save') }}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
    </v-btn>
</template>
