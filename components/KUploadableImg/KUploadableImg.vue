<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KUploadableImg.ts" />

<template>
    <k-upload
        :inline="false"
        :disabled="!apiUploadSrc"
        :endpoint="apiUploadSrc || ''"
        :allowed-file-types="allowedFileTypes"
        @complete="onUploadComplete"
    >
        <template
            v-slot:default="{inline, open}"
        >
            <v-hover
                :class="classes"
                :style="styles"
            >
                <template
                    v-slot:default="{hover}"
                >
                    <v-avatar
                        :size="size"
                        :rounded="rounded"
                        :tile="tile"
                        color="grey"
                    >
                        <v-fade-transition
                            mode="out-in"
                        >
                            <k-img
                                v-if="!!apiSrc"
                                mode="cover"
                                :api-src="apiSrc"
                            >
                                <template
                                    v-slot:placeholder
                                >
                                    <v-icon :size="iconSize">fa fw fa-user</v-icon>
                                </template>
                            </k-img>

                            <v-icon
                                v-else
                                :size="iconSize"
                            >
                                fa fw fa-user
                            </v-icon>
                        </v-fade-transition>

                        <v-fade-transition>
                            <v-overlay
                                v-if="!!apiUploadSrc && hover"
                                absolute
                            >
                                <v-btn
                                    outlined
                                    small
                                    fab
                                    ripple
                                    icon
                                    @click="open"
                                >
                                    <v-icon>camera_alt</v-icon>
                                </v-btn>
                            </v-overlay>
                        </v-fade-transition>
                    </v-avatar>
                </template>
            </v-hover>
        </template>
    </k-upload>
</template>
