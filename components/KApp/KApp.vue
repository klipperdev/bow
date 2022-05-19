<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KApp.ts" />

<template>
    <v-app v-if="!isAuthenticated" key="authApp">
        <v-main>
            <router-view
                :key="mainKey"
            />
        </v-main>
    </v-app>

    <v-app v-else-if="retryStart || (!isInitializedSuccessfully && !isAppReady)" key="initAppError">
        <v-main>
            <v-container fill-height>
                <v-row
                    justify="center"
                    align-content="center"
                >
                    <v-col>
                        <k-error-message
                            :message="self.$t('error.unable-initialize-app' + ( self.$store.state.account.userUnauthorized ? '.authorization' : ''))"
                        >
                            <v-btn
                                v-if="!self.$store.state.account.userUnauthorized"
                                depressed
                                rounded
                                small
                                color="primary"
                                class="ma-3 mt-5"
                                :loading="isInitializationPending"
                                @click="retryStartApp"
                            >
                                {{ $t('retry') }}
                            </v-btn>

                            <v-btn
                                v-if="self.$store.state.auth.authenticated"
                                :depressed="self.$store.state.account.userUnauthorized"
                                :text="!self.$store.state.account.userUnauthorized"
                                rounded
                                small
                                color="primary"
                                class="ma-3 mt-5"
                                :disabled="isInitializationPending"
                                @click="self.$store.dispatch('auth/logout')"
                            >
                                {{ $t('logout') }}
                            </v-btn>
                        </k-error-message>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>

    <v-app v-else-if="appStarted" key="app">
        <slot
            name="snackbar"
        >
            <k-snackbar/>
        </slot>

        <slot
            name="organization-switcher"
        >
            <k-org-switcher/>
        </slot>

        <slot
            name="drawer"
        >
            <k-app-drawer
                :dark="drawerDark"
                :items="genDrawerItems"
                :item-key="drawerItemKey"
            >
                <template v-for="slotItem in getSlotItems('drawer', false)" v-slot:[slotItem.target]="props">
                    <slot :name="slotItem.original" v-bind="props"/>
                </template>
            </k-app-drawer>
        </slot>

        <slot name="toolbar">
            <k-toolbar
                :extension-height="toolbarExtensionHeight"
                :hide-on-scroll="1 !== toolbarExtensionHeight"
                :key="1 !== toolbarExtensionHeight ? 'toolbar-extension' : 'toolbar-simple'"
            >
                <router-view
                    name="toolbar"
                    :key="toolbarKey"
                />

                <template v-slot:app-bar.extension>
                    <router-view
                        name="toolbarExtension"
                        :key="toolbarExtensionKey"
                    />
                </template>

                <template v-for="slotItem in getSlotItems('app-bar', true)" v-slot:[slotItem.target]>
                    <slot :name="slotItem.original"/>
                </template>
            </k-toolbar>
        </slot>

        <slot
            name="main"
        >
            <v-main>
                <router-view
                    v-if="displayMainRoute"
                    :key="mainKey"
                />

                <k-loading
                    v-else
                />
            </v-main>
        </slot>

        <slot
            name="fab"
        >
            <router-view
                name="fab"
                :key="fabKey"
            />
        </slot>

        <slot
            name="default"
        />
    </v-app>
</template>
