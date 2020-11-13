<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./ProfileSettings.ts" />

<template>
    <v-form
        ref="form"
        @submit.prevent
    >
        <v-row
            class="ma-0"
            align="center"
        >
            <v-col
                cols="10"
                class="ma-0 pa-0"
            >
                <v-subheader
                    :class="$classes('primary--text', 'text--lighten-3')"
                >
                    {{ $t('model.profile.label') }}
                </v-subheader>
            </v-col>

            <v-col
                cols="2"
                class="text-right"
            >
                <v-btn
                    :id="'profileSettingsEditBtn' + _uid"
                    :color="$color('primary', 'primary lighten-2')"
                    outlined
                    fab
                    icon
                    ripple
                    rounded
                    x-small
                    :disabled="editMode"
                    @click="editMode = !editMode"
                >
                    <v-icon>edit</v-icon>

                    <v-tooltip
                        :activator="'#profileSettingsEditBtn' + _uid" left
                    >
                        <span>
                            {{ $t('edit') }}
                        </span>
                    </v-tooltip>
                </v-btn>
            </v-col>
        </v-row>

        <v-card>
            <v-container
                class="pt-0 pb-0"
            >
                <k-form-alert
                    :http-error="previousError"
                    metadata="user"
                    :excluded-fields="['first_name', 'last_name']"
                />

                <v-row>
                    <k-col-label
                        vertical
                        :edit-mode="editMode"
                        edit-label-required
                        :label="$mfl('user', 'first_name')"
                        :empty="!loading && !$oc(user).firstName()"
                    >
                        <template v-slot:read>
                            {{ $oc(user).firstName('~') }}
                        </template>

                        <template v-slot:edit>
                            <v-text-field
                                type="text"
                                filled
                                v-model="firstName"
                                autofocus
                                :error-messages="fieldErrors('first_name')"
                                @keydown.enter="save"
                                :disabled="loading"
                                :rules="[$r('required')]"
                            />
                        </template>
                    </k-col-label>

                    <k-col-label
                        vertical
                        :edit-mode="editMode"
                        edit-label-required
                        :label="$mfl('user', 'last_name')"
                        :empty="!loading && !$oc(user).lastName()"
                    >
                        <template v-slot:read>
                            {{ $oc(user).lastName('~') }}
                        </template>

                        <template v-slot:edit>
                            <v-text-field
                                type="text"
                                filled
                                v-model="lastName"
                                :error-messages="fieldErrors('last_name')"
                                @keydown.enter="save"
                                :disabled="loading"
                                :rules="[$r('required')]"
                            />
                        </template>
                    </k-col-label>
                </v-row>
            </v-container>

            <v-fade-transition
                mode="out-in"
            >
                <v-card-actions
                    v-if="editMode"
                    class="pt-0 text-center"
                >
                    <v-spacer/>

                    <v-btn
                        small
                        text
                        @click="cancel"
                    >
                        {{ $t('cancel')}}
                    </v-btn>

                    <v-btn
                        small
                        depressed
                        color="accent"
                        :loading="loading"
                        @click="save"
                    >
                        {{ $t('save')}}
                    </v-btn>
                </v-card-actions>
            </v-fade-transition>
        </v-card>
    </v-form>
</template>
