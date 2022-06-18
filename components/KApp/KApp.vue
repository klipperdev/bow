<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

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
                            :message="$t('error.unable-initialize-app' + ( $store.state.account.userUnauthorized ? '.authorization' : ''))"
                        >
                            <v-btn
                                v-if="!$store.state.account.userUnauthorized"
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
                                v-if="$store.state.auth.authenticated"
                                :depressed="$store.state.account.userUnauthorized"
                                :text="!$store.state.account.userUnauthorized"
                                rounded
                                small
                                color="primary"
                                class="ma-3 mt-5"
                                :disabled="isInitializationPending"
                                @click="$store.dispatch('auth/logout')"
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
            <k-org-switcher v-if="defaultOrgSwitcher"/>
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

        <slot name="toolbar"
            :toolbarKey="toolbarKey"
            :toolbarExtensionKey="toolbarExtensionKey"
            :toolbarExtensionHeight="toolbarExtensionHeight"
        >
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

<script lang="ts">
import {DrawerItem} from '@klipper/bow/drawer/DrawerItem';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {Themer} from '@klipper/bow/themer/Themer';
import {mixins} from 'vue-class-component';
import {MetaInfo} from 'vue-meta';
import {Component, Prop, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KApp extends mixins(
    SlotWrapper,
) {
    @Prop({type: Array, default: undefined})
    public drawerItems!: DrawerItem[];

    @Prop({type: Boolean, default: true})
    public drawerDark!: boolean;

    @Prop({type: Function, default: () => undefined})
    public customSettingsDrawerItems!: () => DrawerItem[]|undefined;

    @Prop({type: Boolean, default: true})
    public defaultOrgSwitcher!: boolean;

    private toolbarExtensionHeight: number | undefined = undefined;

    private fontsReady: boolean = false;

    private appStarted: boolean = false;

    private retryStart: boolean = false;

    private get isAppReady(): boolean {
        return !!this.$store.state.account.user || this.$store.state.account.initializationPending;
    }

    protected get isInitializationPending(): boolean {
        return this.$store.state.auth.authenticationPending
            || this.$store.state.account.initializationPending
            || this.$store.state.metadata.initializationPending
            || this.$store.state.i18n.initializationPending;
    }

    protected get isInitializedSuccessfully(): boolean {
        return !!this.$store.state.account.user
            && this.$store.state.metadata.initialized
            && this.$store.state.i18n.initialized;
    }

    protected get isInitialized(): boolean {
        return this.$store.state.account.initialized;
    }

    protected get isFullyAuthenticated(): boolean {
        return this.$store.state.auth.authenticated
            && !this.$store.state.auth.authenticationPending
            && !this.$store.state.auth.refreshPending;
    }

    protected get isLogout(): boolean {
        return !this.$store.state.auth.authenticated
            && !this.$store.state.auth.authenticationPending
            && !this.$store.state.auth.refreshPending;
    }

    protected get locale(): string {
        return this.$store.state.i18n.locale;
    }

    private get toolbarKey(): string {
        return this.$route.meta && this.$route.meta.toolbarKey
            ? this.$route.meta.toolbarKey
            : this.$route.fullPath;
    }

    private get toolbarExtensionKey(): string {
        return this.$route.meta && this.$route.meta.toolbarExtensionKey
            ? this.$route.meta.toolbarExtensionKey
            : this.$route.fullPath;
    }

    private get mainKey(): string {
        return this.$route.meta && this.$route.meta.mainKey
            ? this.$route.meta.mainKey
            : this.$route.fullPath;
    }

    private get fabKey(): string {
        return this.$route.meta && this.$route.meta.fabKey ? this.$route.meta.fabKey : this.$route.fullPath;
    }

    private get drawerItemKey(): string {
        return this.storeDrawerContext;
    }

    private get darkModeEnabled(): boolean {
        return this.$store.state.darkMode.enabled;
    }

    private get displayMainRoute(): boolean {
        return this.isAuthenticated || (!!this.$route.meta && false === this.$route.meta.requiresInitialization);
    }

    private get isAuthenticated(): boolean {
        return this.$store.state.auth.authenticated;
    }

    private get storeDrawerContext(): string {
        return this.$store.state.drawer.context;
    }

    private get storeDrawerContextItems(): DrawerItem[] {
        return this.$store.state.drawer.contextItems[this.storeDrawerContext] || this.$store.state.drawer.contextItems.user;
    }

    private get genDrawerItems(): DrawerItem[] {
        if (this.drawerItems) {
            return this.drawerItems;
        }

        return this.customSettingsDrawerItems() || this.storeDrawerContextItems;
    }

    public metaInfo(): MetaInfo {
        return {
            title: this.$klipper.name,
            titleTemplate: (titleChunk) => {
                return titleChunk + (titleChunk === this.$klipper.name ? '' : ' · ' + this.$klipper.name);
            },
        };
    }

    public beforeCreate(): void {
        this.toolbarExtensionHeight = undefined;
        this.fontsReady = !!(document as any).fonts;

        if ((document as any).fonts) {
            (document as any).fonts.ready.then(async () => {
                this.fontsReady = true;
                await this.startApp();
            });
        } else {
            this.fontsReady = true;
        }
    }

    public async mounted(): Promise<void> {
        Themer.updateThemeColor('v-application');
        await this.startApp();
    }

    public beforeUpdate(): void {
        this.toolbarExtensionHeight = this.$router.currentRoute.matched[0]
        && !!this.$router.currentRoute.matched[0].components.toolbarExtension
            ? undefined
            : 1;
    }

    protected removePreloader(): void {
        const pl = document.getElementById('pl');

        if (pl) {
            pl.addEventListener('transitionend', () => {
                pl.remove();
                document.getElementsByTagName('html')[0].classList.remove('preloader');
            });
            pl.style.opacity = '0';
        }
    }

    private async startApp(): Promise<void> {
        if (!this.fontsReady) {
            return;
        }

        await this.$store.dispatch('account/initialize');

        if (!!this.$store.state.account.user) {
            await this.$store.dispatch('metadata/initialize');
            await this.$store.dispatch('i18n/initialize');
        }

        this.watchDarkMode(this.darkModeEnabled);
        this.removePreloader();

        this.appStarted = true;
    }

    private async retryStartApp(): Promise<void> {
        this.retryStart = true;
        await this.startApp();
        this.retryStart = false;
    }

    @Watch('darkModeEnabled')
    private watchDarkMode(enabled: boolean): void {
        if (this.$vuetify) {
            this.$vuetify.theme.dark = enabled;
        }

        Themer.updateThemeColor('v-application');
        const htmlEl = document.getElementsByTagName('html')[0];
        htmlEl.classList.remove('theme--light', 'theme--dark');
        htmlEl.classList.add('theme--' + (enabled ? 'dark' : 'light'));
    }

    @Watch('isFullyAuthenticated')
    private async watchAuthentication(authenticated: boolean): Promise<void> {
        if (authenticated) {
            await this.$store.dispatch('account/initialize');
        }
    }

    @Watch('isInitialized')
    private async watchInitialized(initialized: boolean): Promise<void> {
        if (initialized && this.appStarted && !this.retryStart) {
            await this.$store.dispatch('metadata/initialize');
            await this.$store.dispatch('i18n/initialize');
        }
    }

    @Watch('organization')
    private async watchOrganization(): Promise<void> {
        await this.$store.dispatch('metadata/initialize');
        await this.$store.dispatch('i18n/initialize');
    }

    @Watch('isLogout')
    private async watchLogout(logout: boolean): Promise<void> {
        if (logout) {
            await this.$store.dispatch('account/reset');
            this.removePreloader();
        }
    }

    @Watch('locale')
    private async watchLocale(): Promise<void> {
        await this.$store.dispatch('metadata/initialize');
        await this.$store.dispatch('i18n/initialize');
    }
}
</script>
