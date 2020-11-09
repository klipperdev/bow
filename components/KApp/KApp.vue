<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KApp.ts" />

<template>
    <v-app>
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
            <v-fade-transition
                mode="out-in"
            >
                <k-app-drawer
                    v-if="isAuthenticated"
                    :items="drawerItems"
                    :item-key="drawerItemKey"
                >
                    <template v-for="(slotItem) in getSlotItems('drawer', true)" v-slot:[slotItem.target]>
                        <slot :name="slotItem.original"/>
                    </template>
                </k-app-drawer>
            </v-fade-transition>
        </slot>

        <slot name="toolbar">
            <v-fade-transition>
                <k-toolbar
                    v-if="isAuthenticated"
                    :extension-height="toolbarExtensionHeight"
                    :hide-on-scroll="1 !== toolbarExtensionHeight"
                    :key="1 !== toolbarExtensionHeight ? 'toolbar-extension' : 'toolbar-simple'"
                >
                    <v-fade-transition
                        mode="out-in"
                    >
                        <router-view
                            name="toolbar"
                            :key="toolbarKey"
                        />
                    </v-fade-transition>

                    <template v-slot:app-bar.extension>
                        <router-view
                            name="toolbarExtension"
                            :key="toolbarExtensionKey"
                        />
                    </template>

                    <template v-for="(slotItem) in getSlotItems('app-bar', true)" v-slot:[slotItem.target]>
                        <slot :name="slotItem.original"/>
                    </template>
                </k-toolbar>
            </v-fade-transition>
        </slot>

        <slot
            name="main"
        >
            <v-main>
                <transition
                    :name="transitionName"
                    mode="out-in"
                >
                    <router-view
                        v-if="displayMainRoute"
                        :key="mainKey"
                    />

                    <k-loading
                        v-else
                    />
                </transition>
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
