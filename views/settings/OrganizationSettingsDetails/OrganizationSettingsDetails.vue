<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./OrganizationSettingsDetails.ts" />

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
                    :id="'orgSettingsEditBtn' + _uid"
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
                    <v-icon>
                        edit
                    </v-icon>

                    <v-tooltip
                        :activator="'#orgSettingsEditBtn' + _uid" left
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
                    vertical :edit-mode="editMode"
                    edit-label-required
                    :label="$t('model.organization.fields.name')"
                    :empty="!loading && !$oc(organization).name()"
                >
                    <template v-slot:view>
                        {{ $oc(organization).name('~') }}
                    </template>

                    <template v-slot:edit>
                        <v-text-field
                            type="text"
                            filled
                            v-model="name"
                            autofocus
                            :error-messages="fieldErrors('name')"
                            :disabled="loading"
                            :rules="[$r('required')]"
                            @keydown.enter="save"
                        />
                    </template>
                </k-col-label>

                <k-col-label
                    vertical :edit-mode="editMode"
                    edit-label-required
                    :label="$t('model.organization.fields.label')"
                    :empty="!loading && !$oc(organization).label()"
                >
                    <template v-slot:view>
                        {{ $oc(organization).label('~') }}
                    </template>

                    <template v-slot:edit>
                        <v-text-field
                            type="text"
                            filled
                            v-model="label"
                            :error-messages="fieldErrors('label')"
                            :disabled="loading"
                            :rules="[$r('required')]"
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