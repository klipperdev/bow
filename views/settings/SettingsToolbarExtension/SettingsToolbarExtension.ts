/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Selfable} from '@klipper/bow/mixins/Selfable';
import {mixins} from 'vue-class-component';
import {Component, Ref, Vue, Watch} from 'vue-property-decorator';

/**
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class SettingsToolbarExtension extends mixins(
    Selfable,
) {
    @Ref('settingsTabs')
    private readonly settingsTabsRef: Vue|any;

    private tab: string | null = null;

    private get items(): any[] {
        const currentContext = this.$store.getters['account/getContext'];
        const tabs = [];

        for (const route of (this.$router as any).options.routes) {
            if (route.children && route.meta.settings) {
                for (const subRoute of route.children) {
                    if (undefined === subRoute.meta) {
                        continue;
                    }

                    const title = typeof subRoute.meta.title === 'function' ? subRoute.meta.title(this) : subRoute.meta.title;

                    if (title && (!subRoute.meta.context
                        || (Array.isArray(subRoute.meta.context)
                            && subRoute.meta.context.includes(currentContext)))) {
                        tabs.push({
                            name: subRoute.name,
                            label: subRoute.meta.translatable
                                ? this.$t(title)
                                : title,
                            to: {name: subRoute.name, params: {org: this.$org}},
                        });
                    }
                }

                break;
            }
        }

        return tabs;
    }

    private get genToolbarTitle(): string|null {
        if (!!this.$route.meta && !!this.$route.meta.toolbarTitle) {
            return typeof this.$route.meta.toolbarTitle === 'function'
                ? this.$route.meta.toolbarTitle(this)
                : this.$route.meta.toolbarTitle;
        }

        return null;
    }

    @Watch('items')
    private watchItems(): void {
        if (this.settingsTabsRef) {
            this.settingsTabsRef.onResize();
        }
    }
}
