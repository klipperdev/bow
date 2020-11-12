<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KStandardView.ts" />

<template>
    <v-fade-transition
        mode="out-in"
    >
        <k-loading
            v-if="loader && fetchLoading"
            class="mt-5"
        ></k-loading>

        <k-error-message
            v-else-if="showError && !editMode"
            :message="errorMessage" :error-code="errorCode"
        >
            <v-btn
                v-if="errorCode > 0"
                depressed
                rounded
                small
                :color="$color('primary lighten-4', 'primary lighten-3')"
                class="ma-3 mt-5"
                :to="{path: '/'}"
            >
                {{ $t('error.go-to-home') }}
            </v-btn>

            <v-btn
                depressed
                rounded
                small
                :color="$color('primary lighten-4', 'primary lighten-3')"
                class="ma-3 mt-5"
                @click="refresh()"
            >
                {{ $t('refresh') }}
            </v-btn>
        </k-error-message>

        <k-loader-wrapper
            v-else
            :loading="fetchLoading"
            @keydown="onKeyDown"
        >
            <slot
                name="header-prepend"
                v-bind="bindSlotData"
            />

            <v-row
                class="ma-0"
                align="center"
            >
                <v-col
                    class="flex-grow-1 ma-0 pa-0 d-flex align-center"
                >
                    <slot
                        name="header"
                        v-bind="bindSlotData"
                    />
                </v-col>

                <v-col
                    class="flex-grow-0 flex-shrink-1 text-right"
                >
                    <slot
                        name="header-actions"
                        v-bind="bindSlotData"
                    >
                        <v-btn
                            :color="$color('primary', 'primary lighten-2')"
                            depressed
                            ripple
                            rounded
                            small
                            :loading="fetchLoading"
                            :disabled="editMode"
                            @click="refresh()"
                        >
                            <v-icon small>refresh</v-icon>
                        </v-btn>
                    </slot>
                </v-col>
            </v-row>


            <slot
                name="header-append"
                v-bind="bindSlotData"
            />

            <slot
                name="default"
                v-bind="bindSlotData"
            >
                <v-form
                    ref="form" @submit.prevent
                    autocomplete="off"
                >
                    <v-card>
                        <slot
                            name="card-prepend"
                            v-bind="bindSlotData"
                        />

                        <v-fade-transition
                            mode="out-in"
                            origin="top center"
                        >
                            <v-tabs
                                centered
                                v-if="editMode"
                                key="edit"
                            >
                                <v-btn
                                    text
                                    @click="cancelEdit(true)" :disabled="loading"
                                >
                                    {{ $t('cancel')}}
                                </v-btn>

                                <v-btn
                                    depressed
                                    color="accent"
                                    :disabled="fetchLoading"
                                    :loading="pushLoading"
                                    @click="push"
                                >
                                    {{ $t('save')}}
                                </v-btn>

                                <v-btn
                                    v-if="isTranslatable"
                                    outlined
                                    disabled
                                >
                                    {{ currentLocale }}
                                </v-btn>
                            </v-tabs>

                            <v-tabs
                                v-else-if="displayStandardActions"
                                key="view"
                                centered
                            >
                                <slot
                                    name="standard-actions-prepend"
                                    v-bind="bindSlotData"
                                />

                                <slot
                                    name="standard-actions-prepend-top"
                                    v-bind="bindSlotData"
                                />

                                <slot
                                    name="standard-actions"
                                    v-bind="bindSlotData"
                                />

                                <slot
                                    name="standard-actions-top"
                                    v-bind="bindSlotData"
                                />

                                <k-standard-view-button
                                    v-if="displayStandardEditAction && !disableStandardActions"
                                    icon="edit"
                                    :disabled="loading"
                                    @click="enableEdit()"
                                ></k-standard-view-button>

                                <k-delete-action
                                    v-if="displayStandardDeleteAction && !disableStandardActions"
                                    v-model="id"
                                    outlined
                                    :disabled="loading || !id"
                                    :delete-call="deleteItem"
                                    @deleted="onDeletedItem">
                                </k-delete-action>

                                <k-locale-switcher
                                    v-if="isTranslatable"
                                    outlined
                                    :disabled="loading"
                                    :locale="selectedLocale || undefined"
                                    :available-locales="dataAvailableLocales"
                                    :allow-add="displayStandardEditAction && !disableLocaleActions"
                                    :allow-remove="displayStandardDeleteAction && !disableLocaleActions"
                                    @change="onLocaleChange"
                                    @delete="onLocaleDelete"
                                ></k-locale-switcher>

                                <slot
                                    name="standard-actions-append"
                                    v-bind="bindSlotData"
                                />

                                <slot
                                    name="standard-actions-append-top"
                                    v-bind="bindSlotData"
                                />
                            </v-tabs>
                        </v-fade-transition>

                        <k-form-alert
                            :http-error="previousError"
                            :metadata="metadata"
                            :excluded-fields="errorExcludedFields"
                        ></k-form-alert>

                        <slot
                            name="card"
                            v-bind="bindSlotData"
                        />

                        <v-fade-transition
                            mode="out-in"
                        >
                            <v-tabs
                                v-if="editMode"
                                key="edit"
                                centered
                            >
                                <v-btn
                                    text
                                    @click="cancelEdit(true)" :disabled="loading"
                                >
                                    {{ $t('cancel')}}
                                </v-btn>

                                <v-btn
                                    depressed
                                    color="accent"
                                    :disabled="fetchLoading"
                                    :loading="pushLoading"
                                    @click="push"
                                >
                                    {{ $t('save')}}
                                </v-btn>

                                <v-btn
                                    v-if="isTranslatable"
                                    outlined
                                    disabled
                                >
                                    {{ currentLocale }}
                                </v-btn>
                            </v-tabs>

                            <v-tabs
                                centered
                                v-else-if="displayStandardActions"
                                key="view"
                            >
                                <slot
                                    name="standard-actions-prepend"
                                    v-bind="bindSlotData"
                                />

                                <slot
                                    name="standard-actions-prepend-bottom"
                                    v-bind="bindSlotData"
                                />

                                <slot
                                    name="standard-actions"
                                    v-bind="bindSlotData"
                                />

                                <slot
                                    name="standard-actions-bottom"
                                    v-bind="bindSlotData"
                                />

                                <k-standard-view-button
                                    v-if="displayStandardEditAction && !disableStandardActions"
                                    icon="edit"
                                    :disabled="loading"
                                    @click="enableEdit()"
                                ></k-standard-view-button>

                                <k-delete-action
                                    v-if="displayStandardDeleteAction && !disableStandardActions"
                                    v-model="id"
                                    outlined
                                    :disabled="loading || !id"
                                    :delete-call="deleteItem"
                                    @deleted="onDeletedItem">
                                </k-delete-action>

                                <k-locale-switcher
                                    v-if="isTranslatable"
                                    outlined
                                    :disabled="loading"
                                    :locale="selectedLocale || undefined"
                                    :available-locales="dataAvailableLocales"
                                    :allow-add="displayStandardEditAction && !disableLocaleActions"
                                    :allow-remove="displayStandardDeleteAction && !disableLocaleActions"
                                    @change="onLocaleChange"
                                    @delete="onLocaleDelete"
                                ></k-locale-switcher>

                                <slot
                                    name="standard-actions-append"
                                    v-bind="bindSlotData"
                                />

                                <slot
                                    name="standard-actions-append-bottom"
                                    v-bind="bindSlotData"
                                />
                            </v-tabs>
                        </v-fade-transition>

                        <slot
                            name="card-append"
                            v-bind="bindSlotData"
                        />
                    </v-card>
                </v-form>
            </slot>

            <slot
                v-if="displayLists"
                name="lists-prepend"
                v-bind="bindSlotData"
            />

            <slot
                v-if="displayLists"
                name="lists"
                v-bind="bindSlotData"
            />

            <slot
                v-if="displayLists"
                name="lists-append"
                v-bind="bindSlotData"
            />

            <slot
                name="footer-prepend"
                v-bind="bindSlotData"
            />

            <slot
                name="footer"
                v-bind="bindSlotData"
            />

            <slot
                name="footer-append"
                v-bind="bindSlotData"
            />
        </k-loader-wrapper>
    </v-fade-transition>
</template>
