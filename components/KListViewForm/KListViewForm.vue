<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KListViewForm.ts" />

<template>
    <v-dialog
        eager
        v-model="dialog"
        max-width="900"
        persistent
    >
        <v-card>
            <v-card-title
                :class="$classes('primary--text', 'text--lighten-3')"
            >
                <slot
                    name="view-title"
                >
                    {{ $ml('list_view') }}
                </slot>

                <v-spacer />

                <v-card-actions
                    v-if="!!id"
                >
                    <k-delete-action
                        :title="label"
                        v-model="id"
                        rounded
                        small
                        :delete-call="deleteView"
                        @deleted="onDeletedView"
                    />
                </v-card-actions>
            </v-card-title>

            <v-form
                ref="form"
                class="v-card__content-scroller"
                @submit.prevent
            >
                <v-container
                    class="pt-0 pb-0"
                    style="max-height: 69vh;"
                >
                    <k-form-alert
                        :http-error="previousError"
                        metadata="list_view"
                        :excluded-fields="['label', 'name', 'filters']"
                    ></k-form-alert>

                    <v-row>
                        <k-col-label
                            vertical
                            :label="$mfl('list_view', 'label')"
                        >
                            <v-text-field
                                type="text"
                                outlined
                                name="label"
                                v-model="label"
                                autofocus
                                :error-messages="fieldErrors('label')"
                                :disabled="loading"
                                :rules="[$r('required')]"
                                @keydown.enter="save"
                            />
                        </k-col-label>

                        <k-col-label
                            vertical
                            :label="$mfl('list_view', 'name')"
                        >
                            <v-text-field
                                type="text"
                                outlined
                                name="name"
                                v-model="name"
                                :error-messages="fieldErrors('name')"
                                :disabled="loading"
                                :rules="[$r('required')]"
                                @keydown.enter="save"
                            />
                        </k-col-label>
                    </v-row>

                    <v-row>
                        <v-col
                            class="pt-0 pb-0"
                        >
                            <v-switch
                                :label="$t('advanced-mode')"
                                :disabled="true"
                                v-model.sync="advancedMode"
                                class="mt-0"
                                :color="$color('primary', 'primary lighten-3')"
                                hide-details
                            />
                        </v-col>
                    </v-row>

                    <v-expand-transition
                        mode="out-in"
                    >
                        <v-row
                            v-if="advancedMode" key="advanced"
                        >
                            <k-col-label
                                vertical
                                :label="$mfl('list_view', 'filters')"
                                :col-props="{sm: 12}"
                            >
                                <v-textarea
                                    auto-grow
                                    outlined
                                    name="filters"
                                    v-model="filters"
                                    :error-messages="fieldErrors('filters')"
                                    :disabled="loading"
                                    :rules="[$r('required'), $r('json')]"
                                />
                            </k-col-label>
                        </v-row>

                        <v-row
                            v-else
                            key="standard"
                        />
                    </v-expand-transition>
                </v-container>
            </v-form>

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
                    color="accent"
                    depressed
                    ripple
                    :loading="loading"
                    :disabled="loading || !advancedMode"
                    @click="save()"
                >
                    {{ $t('save') }}
                </v-btn>

                <v-btn
                    color="primary"
                    depressed
                    ripple
                    :loading="loading"
                    :disabled="loading || !advancedMode"
                    @click="save(true)"
                >
                    {{ $t('save.copy') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
