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
            <transition :name="transitionName" mode="out-in">
                <k-app-drawer :items="drawerItems" v-if="isAuthenticated">
                    <template v-for="(slotItem) in getSlotItems('drawer', true)"
                              v-slot:[slotItem.target]>
                        <slot :name="slotItem.original"></slot>
                    </template>
                </k-app-drawer>
            </transition>
        </slot>

        <slot name="toolbar">
            <transition :name="transitionName">
                <k-toolbar v-if="isAuthenticated">
                    <transition :name="transitionName" mode="out-in">
                        <router-view name="toolbar" :key="$route.fullPath"></router-view>
                    </transition>

                    <template v-for="(slotItem) in getSlotItems('app-bar', true)"
                              v-slot:[slotItem.target]>
                        <slot :name="slotItem.original"></slot>
                    </template>
                </k-toolbar>
            </transition>
        </slot>

        <slot name="main">
            <v-main>
                <transition :name="transitionName" mode="out-in">
                    <router-view :key="$route.fullPath" v-if="isInitialized || false === $route.meta.requiresInitialization"></router-view>
                    <k-loading v-else></k-loading>
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
    import {Component, Prop, Watch} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {MetaInfo} from 'vue-meta';
    import {Themer} from '../../themer/Themer';
    import {DrawerItem} from '../../drawer/DrawerItem';
    import {SlotWrapper} from '../../slot/mixins/SlotWrapper';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KApp extends mixins(SlotWrapper) {
        public static readonly DEFAULT_TRANSITION: string = 'fade';

        public transitionName: string = KApp.DEFAULT_TRANSITION;

        @Prop({type: Array, required: true})
        public drawerItems?: DrawerItem[];

        private fontsReady: boolean = false;

        public metaInfo(): MetaInfo {
            return {
                title: APP_CONFIG.name,
                titleTemplate: (titleChunk) => {
                    return titleChunk + (titleChunk === APP_CONFIG.name ? '' : ' · ' + APP_CONFIG.name);
                },
            };
        }

        public get darkModeEnabled(): boolean {
            return this.$store.state.darkMode.enabled;
        }

        public get isInitialized(): boolean {
            return this.$store.state.account.initialized;
        }

        public get isAuthenticated(): boolean {
            return this.$store.state.auth.authenticated;
        }

        @Watch('darkModeEnabled')
        public watchDarkMode(enabled: boolean): void {
            if (this.$vuetify) {
                this.$vuetify.theme.dark = enabled;
            }

            Themer.updateThemeColor('v-application');
            const htmlEl = document.getElementsByTagName('html')[0];
            htmlEl.classList.remove('theme--light', 'theme--dark');
            htmlEl.classList.add('theme--' + (enabled ? 'dark' : 'light'));
        }

        @Watch('isAuthenticated')
        public async watchAuthentication(authenticated: boolean): Promise<void> {
            if (authenticated) {
                await this.$store.dispatch('account/initialize');
            } else {
                await this.$store.dispatch('account/reset');
            }
        }

        public beforeCreate(): void {
            this.fontsReady = !!document.fonts;

            if (document.fonts) {
                document.fonts.ready.then(async () => {
                    this.fontsReady = true;
                    await this.startApp();
                });
            } else {
                this.fontsReady = true;
            }
        }

        public created(): void {
            this.watchDarkMode(this.darkModeEnabled);
            this.$router.beforeEach((to, from, next) => {
                let transitionName = to.meta.transitionName || from.meta.transitionName;

                if (transitionName === 'slide') {
                    const toDepth = to.path.split('/').length;
                    const fromDepth = from.path.split('/').length;
                    transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left';
                }

                this.transitionName = transitionName || KApp.DEFAULT_TRANSITION;

                next();
            });
        }

        public async mounted(): Promise<void> {
            Themer.updateThemeColor('v-application');
            await this.startApp();
        }

        private async startApp(): Promise<void> {
            if (!this.fontsReady) {
                return;
            }

            await this.$store.dispatch('account/initialize');
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
