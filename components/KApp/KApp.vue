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

    <v-app v-else key="app">
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
                :items="genDrawerItems"
                :item-key="drawerItemKey"
            >
                <template v-for="slotItem in getSlotItems('drawer', true)" v-slot:[slotItem.target]>
                    <slot :name="slotItem.original"/>
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
