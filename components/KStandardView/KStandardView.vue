<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KStandardView.ts" />

<style lang="scss" src="./KStandardView.scss" />

<template>
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
                color="primary"
                class="ma-3 mt-5"
                :to="{path: '/'}"
            >
                {{ $t('error.go-to-home') }}
            </v-btn>

            <v-btn
                depressed
                rounded
                small
                color="secondary"
                class="ma-3 mt-5"
                @click="refresh()"
            >
                {{ $t('refresh') }}
            </v-btn>
        </k-error-message>

        <k-loader-wrapper
            v-else
            :loading="fetchLoading"
        >
            <v-row>
                <slot
                    name="main-prepend"
                    v-bind="bindSlotData"
                />

                <slot
                    name="main"
                    v-bind="bindSlotData"
                >
                    <v-col>
                        <div
                            class="d-flex flex-column fill-height"
                            @keydown="onKeyDown"
                        >
                            <slot
                                name="header-prepend"
                                v-bind="bindSlotData"
                            />

                            <slot
                                v-if="!hideStandardHeader"
                                name="header-wrapper"
                                v-bind="bindSlotData"
                            >
                                <div class="flex-grow-0">
                                    <div class="k-standard-view-header align-center">
                                        <v-col class="flex-grow-1 ma-0 pa-0 d-flex align-center">
                                            <slot
                                                name="header"
                                                v-bind="bindSlotData"
                                            />
                                        </v-col>

                                        <v-col class="k-standard-view-header-actions pt-0 pb-0 flex-grow-0 flex-shrink-1 text-right">
                                            <slot
                                                name="header-actions"
                                                v-bind="bindSlotData"
                                            >
                                                <k-standard-header-button
                                                    color="primary"
                                                    icon="refresh"
                                                    outlined
                                                    :loading="fetchLoading"
                                                    :disabled="editMode"
                                                    @click="refresh()"
                                                />
                                            </slot>
                                        </v-col>
                                    </div>
                                </div>
                            </slot>

                            <slot
                                name="header-append"
                                v-bind="bindSlotData"
                            />

                            <slot
                                name="content"
                                v-bind="bindSlotData"
                            >
                                <v-form
                                    class="flex-grow-1 flex-shrink-1"
                                    ref="form"
                                    @submit.prevent=""
                                    autocomplete="off"
                                >
                                    <slot
                                        name="form"
                                        v-bind="bindSlotData"
                                    >
                                        <v-card class="mt-3 fill-height">
                                            <slot
                                                name="card-prepend"
                                                v-bind="bindSlotData"
                                            />

                                            <v-tabs
                                                centered
                                                v-if="displayEditStandardDeleteAction"
                                                key="edit-prepend"
                                            >
                                                <v-btn
                                                    text
                                                    rounded
                                                    color="primary"
                                                    @click="cancelEdit(true)" :disabled="loading"
                                                >
                                                    {{ $t('cancel')}}
                                                </v-btn>

                                                <v-btn
                                                    depressed
                                                    rounded
                                                    color="primary"
                                                    :disabled="fetchLoading"
                                                    :loading="pushLoading"
                                                    @click="push"
                                                >
                                                    {{ $t('save')}}
                                                </v-btn>

                                                <v-btn
                                                    v-if="isTranslatable"
                                                    text
                                                    rounded
                                                    disabled
                                                >
                                                    {{ currentLocale }}
                                                </v-btn>
                                            </v-tabs>

                                            <v-tabs
                                                v-else-if="displayStandardActions"
                                                key="view-prepend"
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
                                                    rounded
                                                    :disabled="loading"
                                                    @click="enableEdit()"
                                                />

                                                <k-delete-action
                                                    v-if="displayStandardDeleteAction && !disableStandardActions"
                                                    v-model="id"
                                                    rounded
                                                    :disabled="loading || !id"
                                                    :delete-call="deleteItem"
                                                    @deleted="onDeletedItem"
                                                />

                                                <k-locale-switcher
                                                    v-if="isTranslatable"
                                                    text
                                                    rounded
                                                    color="primary"
                                                    :disabled="loading"
                                                    :locale="selectedLocale || undefined"
                                                    :available-locales="dataAvailableLocales"
                                                    :allow-add="displayStandardEditAction && !disableLocaleActions"
                                                    :allow-remove="displayStandardDeleteAction && !disableLocaleActions"
                                                    @change="onLocaleChange"
                                                    @delete="onLocaleDelete"
                                                />

                                                <slot
                                                    name="standard-actions-append"
                                                    v-bind="bindSlotData"
                                                />

                                                <slot
                                                    name="standard-actions-append-top"
                                                    v-bind="bindSlotData"
                                                />
                                            </v-tabs>

                                            <k-form-alert
                                                :http-error="previousError"
                                                :metadata="metadata"
                                                :excluded-fields="errorExcludedFields"
                                                dismissible
                                            />

                                            <slot
                                                name="card"
                                                v-bind="bindSlotData"
                                            />

                                            <v-tabs
                                                v-if="displayEditStandardDeleteAction"
                                                key="edit-append"
                                                centered
                                            >
                                                <v-btn
                                                    text
                                                    rounded
                                                    color="primary"
                                                    @click="cancelEdit(true)" :disabled="loading"
                                                >
                                                    {{ $t('cancel')}}
                                                </v-btn>

                                                <v-btn
                                                    depressed
                                                    rounded
                                                    color="primary"
                                                    :disabled="fetchLoading"
                                                    :loading="pushLoading"
                                                    @click="push"
                                                >
                                                    {{ $t('save')}}
                                                </v-btn>

                                                <v-btn
                                                    v-if="isTranslatable"
                                                    text
                                                    rounded
                                                    disabled
                                                >
                                                    {{ currentLocale }}
                                                </v-btn>
                                            </v-tabs>

                                            <v-tabs
                                                centered
                                                v-else-if="displayStandardActions && editMode"
                                                key="view-append"
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
                                                    rounded
                                                    :disabled="loading"
                                                    @click="enableEdit()"
                                                />

                                                <k-delete-action
                                                    v-if="displayStandardDeleteAction && !disableStandardActions"
                                                    v-model="id"
                                                    rounded
                                                    :disabled="loading || !id"
                                                    :delete-call="deleteItem"
                                                    @deleted="onDeletedItem"
                                                />

                                                <k-locale-switcher
                                                    v-if="isTranslatable"
                                                    text
                                                    rounded
                                                    color="primary"
                                                    :disabled="loading"
                                                    :locale="selectedLocale || undefined"
                                                    :available-locales="dataAvailableLocales"
                                                    :allow-add="displayStandardEditAction && !disableLocaleActions"
                                                    :allow-remove="displayStandardDeleteAction && !disableLocaleActions"
                                                    @change="onLocaleChange"
                                                    @delete="onLocaleDelete"
                                                />

                                                <slot
                                                    name="standard-actions-append"
                                                    v-bind="bindSlotData"
                                                />

                                                <slot
                                                    name="standard-actions-append-bottom"
                                                    v-bind="bindSlotData"
                                                />
                                            </v-tabs>

                                            <slot
                                                name="card-append"
                                                v-bind="bindSlotData"
                                            />
                                        </v-card>
                                    </slot>
                                </v-form>
                            </slot>
                        </div>
                    </v-col>
                </slot>

                <slot
                    name="main-append"
                    v-bind="bindSlotData"
                />
            </v-row>

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

            <slot
                name="default"
                v-bind="bindSlotData"
            />
        </k-loader-wrapper>
</template>
