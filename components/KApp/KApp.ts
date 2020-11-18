/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

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

    @Prop({type: Function, default: () => undefined})
    public customSettingsDrawerItems!: () => DrawerItem[]|undefined;

    private toolbarExtensionHeight: number | undefined = undefined;

    private fontsReady: boolean = false;

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
        return this.$route.meta.toolbarKey || this.$route.fullPath;
    }

    private get toolbarExtensionKey(): string {
        return this.$route.meta.toolbarExtensionKey || this.$route.fullPath;
    }

    private get mainKey(): string {
        return this.$route.meta.mainKey || this.$route.fullPath;
    }

    private get fabKey(): string {
        return this.$route.meta.fabKey || this.$route.fullPath;
    }

    private get drawerItemKey(): string {
        return this.storeDrawerContext;
    }

    private get darkModeEnabled(): boolean {
        return this.$store.state.darkMode.enabled;
    }

    private get displayMainRoute(): boolean {
        return this.isAuthenticated || false === this.$route.meta.requiresInitialization;
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

    private async startApp(): Promise<void> {
        if (!this.fontsReady) {
            return;
        }

        await this.$store.dispatch('account/initialize');
        await this.$store.dispatch('metadata/initialize');
        await this.$store.dispatch('i18n/initialize');
        this.watchDarkMode(this.darkModeEnabled);
        const pl = document.getElementById('pl');

        if (pl) {
            pl.addEventListener('transitionend', () => {
                pl.remove();
                document.getElementsByTagName('html')[0].classList.remove('preloader');
            });
            pl.style.opacity = '0';
        }
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
        if (initialized) {
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
        }
    }

    @Watch('locale')
    private async watchLocale(): Promise<void> {
        await this.$store.dispatch('metadata/initialize');
        await this.$store.dispatch('i18n/initialize');
    }
}
