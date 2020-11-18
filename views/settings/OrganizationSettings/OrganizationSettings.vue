<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./OrganizationSettings.ts" />

<template>
    <div
        v-if="organization"
    >
        <v-subheader
            :class="$classes('primary--text', 'text--lighten-3')"
        >
            {{ $t('views.settings.organization-account') }}
        </v-subheader>

        <v-card>
            <v-list
                two-line
            >
                <v-list-item>
                    <!-- Organization Image -->
                    <v-list-item-avatar
                        :color="imageBackgroundColor"
                    >
                        <k-img
                            v-if="organization && organization.imageUrl"
                            :api-src="organization.imageUrl"
                            mode="cover"
                        >
                            <template v-slot:default="{loaded}">
                                <v-row
                                    v-if="!loaded"
                                    class="fill-height ma-0"
                                    align="center"
                                    justify="center"
                                >
                                    <span
                                        class="white--text text-h6"
                                    >
                                        {{ $oc(organization).initial() }}
                                    </span>
                                </v-row>
                            </template>
                        </k-img>

                        <v-icon
                            v-else
                            dark
                        >
                            fa fa-fw fa-building
                        </v-icon>
                    </v-list-item-avatar>

                    <!-- Organization Info -->
                    <v-list-item-content>
                        <v-list-item-title
                            class="font-weight-bold"
                        >
                            {{ $oc(organization).label() }}
                        </v-list-item-title>

                        <v-list-item-subtitle>
                            {{ $oc(organization).name() }}
                        </v-list-item-subtitle>
                    </v-list-item-content>

                    <!-- Upload Organization Image -->
                    <v-list-item-action
                        v-if="account"
                    >
                        <k-upload
                            :inline="false"
                            :endpoint="uploadOrganizationImageEndpoint"
                            :allowed-file-types="allowedFileTypes"
                            @complete="$uploader.refreshAccount(true)"
                        >
                            <template v-slot:default="{inline, open}">
                                <v-btn
                                    :id="'uploadOrganizationImage_' + _uid"
                                    outlined
                                    small
                                    fab
                                    :color="$color('primary', '')"
                                    ripple
                                    icon
                                    @click="open"
                                >
                                    <v-icon>
                                        camera_alt
                                    </v-icon>

                                    <v-tooltip
                                        v-if="!inline"
                                        :activator="'#uploadOrganizationImage_' + _uid"
                                        left
                                    >
                                        <span>
                                            {{ $t('views.settings.upload-organization-image') }}
                                        </span>
                                    </v-tooltip>
                                </v-btn>
                            </template>
                        </k-upload>
                    </v-list-item-action>
                </v-list-item>
            </v-list>

            <organization-settings-details
                class="mt-3"
            />
        </v-card>
    </div>
</template>
