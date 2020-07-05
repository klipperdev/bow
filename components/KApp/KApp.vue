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

        <slot name="organization-switcher">
            <k-org-switcher></k-org-switcher>
        </slot>

        <slot name="drawer">
            <v-fade-transition mode="out-in">
                <k-app-drawer :items="drawerItems" v-if="isAuthenticated">
                    <template v-for="(slotItem) in getSlotItems('drawer', true)"
                              v-slot:[slotItem.target]>
                        <slot :name="slotItem.original"></slot>
                    </template>
                </k-app-drawer>
            </v-fade-transition>
        </slot>

        <slot name="toolbar">
            <v-fade-transition>
                <k-toolbar v-if="isAuthenticated"
                           :extension-height="toolbarExtensionHeight"
                           :hide-on-scroll="1 !== toolbarExtensionHeight"
                >
                    <v-fade-transition mode="out-in">
                        <router-view name="toolbar" :key="toolbarKey"></router-view>
                    </v-fade-transition>

                    <template v-slot:app-bar.extension>
                        <router-view name="toolbarExtension" :key="toolbarExtensionKey"></router-view>
                    </template>

                    <template v-for="(slotItem) in getSlotItems('app-bar', true)"
                              v-slot:[slotItem.target]>
                        <slot :name="slotItem.original"></slot>
                    </template>
                </k-toolbar>
            </v-fade-transition>
        </slot>

        <slot name="main">
            <v-main>
                <transition :name="transitionName" mode="out-in">
                    <router-view :key="mainKey" v-if="isInitialized || false === $route.meta.requiresInitialization"></router-view>
                    <k-loading v-else></k-loading>
                </transition>
            </v-main>
        </slot>

        <slot name="fab">
            <router-view name="fab" :key="fabKey"></router-view>
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
        public static readonly DEFAULT_TRANSITION: string = 'slide-y-transition';

        public transitionName: string = KApp.DEFAULT_TRANSITION;

        public toolbarExtensionHeight: number|string = '';

        @Prop({type: Array, required: true})
        public drawerItems?: DrawerItem[];

        private fontsReady: boolean = false;

        public get toolbarKey(): string {
            return this.$route.meta.toolbarKey || this.$route.fullPath;
        }

        public get toolbarExtensionKey(): string {
            return this.$route.meta.toolbarExtensionKey || this.$route.fullPath;
        }

        public get mainKey(): string {
            return this.$route.meta.mainKey || this.$route.fullPath;
        }

        public get fabKey(): string {
            return this.$route.meta.fabKey || this.$route.fullPath;
        }

        public metaInfo(): MetaInfo {
            return {
                title: this.$klipper.name,
                titleTemplate: (titleChunk) => {
                    return titleChunk + (titleChunk === this.$klipper.name ? '' : ' · ' + this.$klipper.name);
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

        public get isFullyAuthenticated(): boolean {
            return this.$store.state.auth.authenticated
                && !this.$store.state.auth.authenticationPending
                && !this.$store.state.auth.refreshPending;
        }

        public get isLogout(): boolean {
            return !this.$store.state.auth.authenticated
                && !this.$store.state.auth.authenticationPending
                && !this.$store.state.auth.refreshPending;
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

        @Watch('isFullyAuthenticated')
        public async watchAuthentication(authenticated: boolean): Promise<void> {
            if (authenticated) {
                await this.$store.dispatch('account/initialize');
            }
        }

        @Watch('isLogout')
        public async watchLogout(logout: boolean): Promise<void> {
            if (logout) {
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

        public beforeUpdate(): void {
            this.toolbarExtensionHeight = !!this.$router.currentRoute.matched[0].components.toolbarExtension
                ? undefined
                : 1;
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
