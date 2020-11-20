<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./AccountSettings.ts" />

<template>
    <v-container>
        <k-error-message
            v-if="!account || !user"
            :message="$t('error')"
        />

        <v-row
            v-else
            no-gutters
            justify="center"
            align-content="space-between"
        >
            <v-col
                cols="12"
                sm="10"
                md="8"
                xl="6"
            >
                <!-- User account -->
                <v-subheader
                    :class="$classes('primary--text', 'text--lighten-3')"
                >
                    {{ $t('views.settings.user-account') }}
                </v-subheader>

                <v-card>
                    <v-list
                        two-line
                    >
                        <v-list-item>
                            <!-- User Image -->
                            <v-list-item-avatar
                                color="primary"
                            >
                                <v-fade-transition
                                    mode="out-in"
                                >
                                    <k-img
                                        v-if="user && user.imageUrl"
                                        :api-src="user.imageUrl"
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
                                                    {{ user.initial }}
                                                </span>
                                            </v-row>
                                        </template>
                                    </k-img>

                                    <v-icon
                                        v-else
                                        dark
                                    >
                                        fa fa-fw fa-user-alt
                                    </v-icon>
                                </v-fade-transition>
                            </v-list-item-avatar>

                            <!-- User Profile Info -->
                            <v-list-item-content>
                                <v-list-item-title
                                    class="font-weight-bold"
                                >
                                    <slot
                                        name="title"
                                        :account="account"
                                        :user="user"
                                    >
                                        {{ user.fullName || user.email }}
                                    </slot>
                                </v-list-item-title>

                                <v-list-item-subtitle
                                    v-if="!!user.fullName"
                                >
                                    <slot
                                        name="subtitle"
                                        :account="account"
                                        :user="user"
                                    >
                                        {{ user.email }}
                                    </slot>
                                </v-list-item-subtitle>
                            </v-list-item-content>

                            <!-- Upload User Image -->
                            <v-list-item-action
                                v-if="account"
                            >
                                <k-upload
                                    :inline="false"
                                    :endpoint="uploadUserImageEndpoint"
                                    :allowed-file-types="allowedFileTypes"
                                    @complete="$uploader.refreshAccount()"
                                >
                                    <template v-slot:default="{inline, open}">
                                        <v-btn
                                            :id="'uploadUserImage_' + _uid"
                                            outlined
                                            small
                                            fab
                                            color="accent"
                                            ripple
                                            icon
                                            @click="open"
                                        >
                                            <v-icon>camera_alt</v-icon>

                                            <v-tooltip
                                                v-if="!inline"
                                                :activator="'#uploadUserImage_' + _uid"
                                                left
                                            >
                                                <span>
                                                    {{ $t('views.settings.upload-user-image') }}
                                                </span>
                                            </v-tooltip>
                                        </v-btn>
                                    </template>
                                </k-upload>
                            </v-list-item-action>

                            <!-- Logout action -->
                            <v-list-item-action>
                                <v-btn
                                    :id="'logoutBtn_' + _uid"
                                    outlined
                                    small
                                    fab
                                    color="secondary"
                                    ripple
                                    icon
                                    :loading="$store.state.auth && $store.state.auth.logoutPending"
                                    @click="$store.dispatch('auth/logout', $router.currentRoute.fullPath)"
                                >
                                    <v-icon>
                                        exit_to_app
                                    </v-icon>

                                    <v-tooltip
                                        :activator="'#logoutBtn_' + _uid"
                                        left
                                    >
                                        <span>
                                            {{ $t('logout') }}
                                        </span>
                                    </v-tooltip>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>

                    <user-settings
                        class="mt-3"
                    />
                </v-card>

                <!-- User Profile Details -->
                <profile-settings
                    class="mt-3"
                />

                <!-- General -->
                <v-subheader
                    :class="$classes('mt-4 primary--text', 'text--lighten-3')"
                >
                    {{ $t('views.settings.general') }}
                </v-subheader>

                <v-card>
                    <v-list>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>
                                    {{ $t('views.settings.language') }}
                                </v-list-item-title>
                            </v-list-item-content>

                            <v-list-item-action>
                                <div :id="'switchLanguage_' + _uid"
                                    class="menu-activator"
                                >
                                    <span>
                                        {{ selectedLanguage }}
                                    </span>

                                    <v-icon>
                                        arrow_drop_down
                                    </v-icon>
                                </div>

                                <v-menu
                                    :activator="'#switchLanguage_' + _uid"
                                >
                                    <v-list>
                                        <v-list-item
                                            v-for="available in languageAvailables"
                                            :key="available.code"
                                            @click="$store.commit('i18n/setLocale', available.code)"
                                        >
                                            <v-list-item-content>
                                                <v-list-item-title
                                                    v-text="available.label"
                                                />
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </v-list-item-action>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>
                                    {{ $t('dark-mode') }}
                                </v-list-item-title>
                            </v-list-item-content>

                            <v-list-item-action>
                                <v-switch
                                    hide-details
                                    v-model="darkMode"
                                    color="accent"
                                />
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </v-card>

                <!-- Organization Info -->
                <organization-settings
                    class="mt-5"
                />
            </v-col>
        </v-row>
    </v-container>
</template>
