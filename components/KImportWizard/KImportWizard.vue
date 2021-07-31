<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KImportWizard.ts" />

<template>
    <v-dialog
        eager
        v-bind="genDialogProps"
        v-model="open"
        max-width="900"
        persistent
        transition=""
    >
        <v-card>
            <v-card-title
                :class="self.$classes('primary--text', 'text--lighten-2')"
            >
                <slot
                    name="wizard-title"
                >
                    {{ $ml('import') }}
                </slot>
            </v-card-title>

            <v-slide-x-transition mode="out-in">
                <v-card-text
                    v-if="step === 'complete'"
                    key="complete"
                >
                    <v-alert
                        :type="completeAlertType"
                    >
                        {{ 'success' === completeAlertType ? $t('component.import.message.success') : completeAlertErrorMessage }}
                    </v-alert>

                    <k-card-section locked>
                        <v-row>
                            <k-col-label
                                :label="self.$mfl('import', 'total_count')"
                                single
                                :empty="false"
                            >
                                <k-number
                                    :value="self.$oc(importData).total_count(0)"
                                    :scale="0"
                                />
                            </k-col-label>
                        </v-row>

                        <v-row>
                            <k-col-label
                                :label="self.$mfl('import', 'success_count')"
                                single
                                :empty="false"
                            >
                                <k-number
                                    :value="self.$oc(importData).success_count(0)"
                                    :scale="0"
                                />
                            </k-col-label>
                        </v-row>

                        <v-row>
                            <k-col-label
                                :label="self.$mfl('import', 'error_count')"
                                single
                                :empty="false"
                            >
                                <k-number
                                    :value="self.$oc(importData).error_count(0)"
                                    :scale="0"
                                />
                            </k-col-label>
                        </v-row>
                    </k-card-section>

                    <v-container fluid>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-btn
                                    color="accent"
                                    x-large
                                    depressed
                                    block
                                    :disabled="loading || !self.$oc(importData).original_file_url()"
                                    @click="downloadFile(self.$oc(importData).original_file_url())"
                                >
                                    <v-icon left>fa-fw fa-file-download</v-icon>
                                    {{ $t('component.import.button.download_original_file') }}
                                </v-btn>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-btn
                                    color="accent"
                                    x-large
                                    depressed
                                    block
                                    :disabled="loading || !self.$oc(importData).result_file_url()"
                                    @click="downloadFile(self.$oc(importData).result_file_url())"
                                >
                                    <v-icon left>fa-fw fa-file-download</v-icon>
                                    {{ $t('component.import.button.download_result_file') }}
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>

                <v-card-text
                    v-else-if="step === 'progress'"
                    key="progress"
                    class="py-15"
                >
                    <v-progress-linear
                        height="8"
                        color="accent"
                        indeterminate
                    />

                    <div class="caption text-align-center mt-2">
                        {{ $t('import.in-progress') }}
                    </div>
                </v-card-text>

                <v-card-text
                    v-else
                    key="import"
                >
                    <k-upload
                        height="100%"
                        inline
                        :endpoint="uploadImportEndpoint"
                        :allowed-file-types="allowedFileTypes"
                        :max-file-size="maxFileSize"
                        @upload="onUpload"
                        @complete="onUploadCompleted"
                        @cancel-all="onUploadCancel"
                    />
                </v-card-text>
            </v-slide-x-transition>

            <v-card-actions>
                <v-spacer />

                <v-btn
                    v-if="'import' === step"
                    text
                    ripple
                    color="primary"
                    :disabled="loading"
                    @click="open = false"
                >
                    {{ $t('cancel') }}
                </v-btn>

                <v-btn
                    v-if="'complete' === step"
                    depressed
                    ripple
                    color="primary"
                    :disabled="loading"
                    @click="open = false; reset();"
                >
                    {{ $t('close') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
