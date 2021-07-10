<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KStandardComponentModal.ts" />

<template>
    <v-dialog
        v-model="dialog"
        v-bind="dialogProps"
        transition=""
    >
        <k-standard-component
            ref="stdView"
            :value="value"
            v-bind="$attrs"
            v-on="$listeners"
            :metadata="metadata"
            :refresh-on-init="false"
            @upserted="onUpserted"
        >
            <template v-slot:default="props">
                <v-card>
                    <slot name="header" v-bind="getSlotProps(props)">
                        <v-card-title>
                            <slot name="header.title" v-bind="getSlotProps(props)">
                                {{ $ml(metadata) }}
                            </slot>
                        </v-card-title>
                    </slot>

                    <v-container
                        class="v-card__content-scroller pt-0 pb-0"
                        style="max-height: calc(82vh - 120px);"
                    >
                        <k-form-alert
                            dismissible
                            :http-error="props.error"
                            :metadata="metadata"
                            :excluded-fields="['price', 'internal_comment', 'public_comment']"
                        />

                        <slot
                            name="default"
                            v-bind="getSlotProps(props)"
                        />
                    </v-container>

                    <v-card-actions>
                        <v-spacer />

                        <slot
                            name="actions"
                            v-bind="getSlotProps(props)"
                        >
                            <slot
                                v-if="props.editMode"
                                name="actions.cancel"
                                v-bind="getSlotProps(props)"
                            >
                                <v-btn
                                    text
                                    ripple
                                    :disabled="props.loading"
                                    large
                                    @click="close"
                                >
                                    {{ $t('cancel') }}
                                </v-btn>
                            </slot>

                            <slot
                                v-if="props.editMode"
                                name="actions.save"
                                v-bind="getSlotProps(props)"
                            >
                                <v-btn
                                    :color="saveButtonColor"
                                    dark
                                    depressed
                                    ripple
                                    large
                                    :loading="props.loading"
                                    @click="props.push"
                                >
                                    {{ $t('save') }}
                                </v-btn>
                            </slot>

                            <slot
                                v-if="!props.editMode"
                                name="actions.close"
                                v-bind="getSlotProps(props)"
                            >
                                <v-btn
                                    text
                                    ripple
                                    :disabled="props.loading"
                                    large
                                    @click="close"
                                >
                                    {{ $t('close') }}
                                </v-btn>
                            </slot>
                        </slot>
                    </v-card-actions>
                </v-card>
            </template>
        </k-standard-component>
    </v-dialog>
</template>
