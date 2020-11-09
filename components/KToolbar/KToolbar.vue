<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KToolbar.ts" />

<template>
    <v-app-bar
        app
        :extension-height.sync="extensionHeight"
        elevate-on-scroll
        :scroll-target.sync="scrollTarget"
        scroll-threshold="5"
        :hide-on-scroll="hideOnScroll"
        class="v-app-bar--transparent-on-top"
    >
        <slot
            name="menu"
        >
            <v-scale-transition
                origin="center center"
                mode="out-in"
            >
                <v-app-bar-nav-icon
                    v-if="!showPreviousButton"
                    @click.prevent="drawerButtonAction"
                    key="menu-btn"
                    class="mr-2"
                >
                    <v-icon>menu</v-icon>
                </v-app-bar-nav-icon>

                <v-btn
                    v-else
                    icon
                    @click.prevent="previousButtonAction"
                    @long-click="drawerButtonAction"
                    key="previous-btn"
                    class="mr-2"
                >
                    <v-icon>arrow_back</v-icon>
                </v-btn>
            </v-scale-transition>
        </slot>

        <slot
            name="title"
        >
            <v-slide-y-transition
                mode="out-in"
            >
                <v-toolbar-title
                    v-if="!!title"
                    :key="title"
                >
                    {{ title }}
                </v-toolbar-title>
            </v-slide-y-transition>
        </slot>

        <slot
            name="default"
        >
            <v-spacer />
        </slot>

        <slot
            name="online-status"
        >
            <k-online-status
                class="mr-4"
            ></k-online-status>
        </slot>

        <slot
            name="actions"
        ></slot>

        <slot
            name="profile-menu"
        >
            <k-profile-menu />
        </slot>

        <template v-for="(slotItem) in getSlotItems('app-bar')" v-slot:[slotItem.target]>
            <slot :name="slotItem.original"/>
        </template>
    </v-app-bar>
</template>
