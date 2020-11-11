<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./UserSettings.ts" />

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
                    {{ $t('details') }}
                </v-subheader>
            </v-col>

            <v-col
                cols="2"
                class="text-right"
            >
                <v-btn
                    :id="'userSettingsEditBtn_' + _uid"
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
                        :activator="'#userSettingsEditBtn_' + _uid" left
                    >
                        <span>
                            {{ $t('edit') }}
                        </span>
                    </v-tooltip>
                </v-btn>
            </v-col>
        </v-row>

        <v-container
            class="pt-0 pb-0"
        >
            <v-alert
                type="error"
                class="ma-1"
                transition="slide-y-reverse-transition"
                mode="out-in"
                :value="editMode && showFormAlert"
            >
                {{ formAlert }}
            </v-alert>

            <v-row>
                <k-col-label
                    vertical
                    :edit-mode="editMode"
                    edit-label-required
                    :label="$t('model.user.fields.username')"
                    :empty="!loading && !$oc(user).username()"
                >
                    <template v-slot:view>
                        {{ $oc(user).username('~') }}
                    </template>

                    <template v-slot:edit>
                        <v-text-field
                            type="text"
                            filled
                            v-model="username"
                            autofocus
                            :error-messages="fieldErrors('username')"
                            :disabled="loading"
                            :rules="[$r('required')]"
                            @keydown.enter="save"
                        />
                    </template>
                </k-col-label>

                <k-col-label
                    vertical
                    :edit-mode="editMode"
                    edit-label-required
                    :label="$t('model.user.fields.email')"
                    :empty="!loading && !$oc(user).email()"
                >
                    <template v-slot:view>
                        {{ $oc(user).email('~') }}
                    </template>

                    <template v-slot:edit>
                        <v-text-field
                            type="text"
                            filled
                            v-model="email"
                            :error-messages="fieldErrors('email')"
                            :disabled="loading"
                            :rules="[$r('required'), $r('email')]"
                            @keydown.enter="save"
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
    </v-form>
</template>