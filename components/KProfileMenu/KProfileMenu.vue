<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KProfileMenu.ts" />

<template>
    <v-btn
        :id="'profileMenuBtn_' + _uid"
        v-bind="$attrs"
        color="secondary"
        depressed
        fab
        small
        :loading="pending"
        @click="retry()"
    >
        <v-avatar
            size="42"
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
                            {{ initial }}
                        </span>
                    </v-row>
                </template>
            </k-img>

            <span
                v-else-if="user"
                class="text-h6"
            >
                {{ initial }}
            </span>

            <v-icon
                v-else
                small
            >
                fa fa-fw fa-user
            </v-icon>
        </v-avatar>

        <v-menu
            v-if="!disabled"
            :activator="'#profileMenuBtn_' + _uid"
            v-model="menu"
            :close-on-content-click="false"
            min-width="300"
            max-width="90%"
            max-height="90%"
            transition="slide-y-transition"
            origin="top right"
        >
            <v-card>
                <v-list
                    v-if="!!user"
                >
                    <v-list-item>
                        <v-list-item-icon>
                            <slot
                                name="avatar"
                                :account="account"
                                :user="user"
                            >
                                <v-avatar
                                    color="primary"
                                    size="72"
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
                                                    class="white--text text-h4"
                                                >
                                                    {{ initial }}
                                                </span>
                                            </v-row>
                                        </template>
                                    </k-img>

                                    <span
                                        v-else-if="user"
                                        class="white--text text-h6"
                                    >
                                        {{ initial }}
                                    </span>

                                    <v-icon
                                        v-else
                                        small
                                        dark
                                    >
                                        fa fa-fw fa-user
                                    </v-icon>
                                </v-avatar>
                            </slot>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title
                                class="font-weight-bold"
                            >
                                <slot
                                    name="title"
                                    :account="account" :user="user"
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
                    </v-list-item>
                </v-list>

                <v-divider />

                <v-card-actions>
                    <slot
                        name="actions"
                        :account="account"
                        :user="user"
                    >
                        <v-btn
                            :id="'profileMenuToggleBtn_' + _uid"
                            text
                            @click="$store.commit('darkMode/toggle')"
                        >
                            <v-icon
                                v-if="$store.state.darkMode.enabled"
                                key="light"
                                color="amber lighten-2"
                            >
                                fa fa-fw fa-sun
                            </v-icon>

                            <v-icon
                                v-else
                                key="dark"
                                color="deep-purple darken-2"
                            >
                                fa fa-fw fa-moon
                            </v-icon>

                            <v-tooltip
                                :activator="'#profileMenuToggleBtn_' + _uid"
                                right
                                open-delay="600"
                            >
                                <span>
                                    {{ $t($store.state.darkMode.enabled ? 'light-mode' : 'dark-mode') }}
                                </span>
                            </v-tooltip>
                        </v-btn>

                        <v-spacer />

                        <v-btn
                            color="secondary"
                            text
                            @click="logout"
                        >
                            {{ $t('logout') }}
                        </v-btn>
                    </slot>
                </v-card-actions>
            </v-card>
        </v-menu>
    </v-btn>
</template>
