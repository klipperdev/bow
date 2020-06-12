<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-app>
        <slot name="snackbar">
            <k-snackbar></k-snackbar>
        </slot>

        <slot name="drawer">
            <transition :name="transitionName">
                <k-app-drawer :items="drawerItems" v-if="$store.state.auth.authenticated">
                </k-app-drawer>
            </transition>
        </slot>

        <slot name="toolbar">
            <transition :name="transitionName">
                <toolbar v-if="$store.state.auth.authenticated">
                    <transition :name="transitionName" mode="out-in">
                        <router-view name="toolbar" :key="$route.fullPath"></router-view>
                    </transition>
                </toolbar>
            </transition>
        </slot>

        <slot name="main">
            <v-main>
                <transition :name="transitionName" mode="out-in">
                    <router-view :key="$route.fullPath"></router-view>
                </transition>
            </v-main>
        </slot>

        <slot name="fab">
            <router-view name="fab"></router-view>
        </slot>

        <slot name="default"></slot>
    </v-app>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {Component, Prop} from 'vue-property-decorator';
    import {Themer} from '../../themer/Themer';
    import {DrawerItem} from '../../drawer/DrawerItem';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KApp extends Vue {
        public static readonly DEFAULT_TRANSITION: string = 'fade';

        public transitionName: string = KApp.DEFAULT_TRANSITION;

        @Prop({type: Array, required: true})
        public drawerItems?: DrawerItem[];

        public async mounted(): Promise<void> {
            Themer.updateThemeColor('v-application');
            const pl = document.getElementById('pl');

            if (pl) {
                pl.addEventListener('transitionend', () => {
                    pl.remove();
                    document.getElementsByTagName('html')[0].classList.remove('preloader');
                });
                pl.style.opacity = '0';
            }
        }
    }
</script>
