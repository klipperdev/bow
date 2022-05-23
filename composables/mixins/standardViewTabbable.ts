/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {provide as RegistrableProvide} from '@klipper/bow/composables/mixins/registrable';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {ObjectMetadata} from '@klipper/bow/metadata/ObjectMetadata';
import {StandardViewTab} from '@klipper/bow/standardView/StandardViewTab';
import {replaceRouteQuery, restoreRouteQuery} from '@klipper/bow/utils/router';
import Vue, {PropType} from 'vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
interface Props {
    tabsCentered: boolean;
    tabsRight: boolean;
    tabsFluid: boolean;
    headingFluid: boolean;
    routeQueryPrefix?: string;
    headingContainerProps: Dictionary<any>;
    headingContainerTabsProps: Dictionary<any>;
    tabsProps: Dictionary<any>;
}

interface Data {
    tabs: StandardViewTab[];
    tab: number|null;
    genTab: number|null;
}

interface Computed {
    get metadatas(): Dictionary<ObjectMetadata>;
    get currentTab(): StandardViewTab|undefined;
    get genTabs(): StandardViewTab[];
    get genTabbableBindSlotData(): any;
}

interface Methods {
}

export const StandardViewTabbable = Vue.extend<Data, Methods, Computed, Props>({
    name: 'standardViewTabbable',

    mixins: [
        RegistrableProvide('standardViewTab', false, 'tabRegister', 'tabUnregister'),
    ],

    props: {
        tabsCentered: {
            type: Boolean,
            default: false,
        },

        tabsRight: {
            type: Boolean,
            default: false,
        },

        tabsFluid: {
            type: Boolean,
            default: false,
        },

        headingFluid: {
            type: Boolean,
            default: false,
        },

        routeQueryPrefix: {
            type: String,
        },

        headingContainerProps: {
            type: Object as PropType<Dictionary<any>>,
            default: () => ({}),
        },

        headingContainerTabsProps: {
            type: Object as PropType<Dictionary<any>>,
            default: () => ({}),
        },

        tabsProps: {
            type: Object as PropType<Dictionary<any>>,
            default: () => ({}),
        },
    },

    data() {
        return {
            tabs: [],
            tab: null,
            genTab: null,
        };
    },

    computed: {
        metadatas(): Dictionary<ObjectMetadata> {
            return this.$store.state.metadata.metadatas;
        },

        currentTab(): StandardViewTab|undefined {
            return this.tabs[this.tab ?? -1] ?? undefined;
        },

        genTabs(): StandardViewTab[] {
            if (!(this as any).isCreate) {
                return this.tabs;
            }

            return this.tabs.filter((tab: StandardViewTab) => {
                return tab.isCreatable;
            });
        },

        genTabbableBindSlotData(): any {
            return {
                tabsCentered: this.tabsCentered,
                tabsRight: this.tabsRight,
                tabsFluid: this.tabsFluid,
                headingFluid: this.headingFluid,
                tabs: this.tabs,
                currentTab: this.currentTab,
                setTabIndex: this.setTabIndex,
                setTabCount: this.setTabCount,
            };
        },
    },

    methods: {
        tabRegister(tab: StandardViewTab): void {
            this.tabs.push(tab);

            const qTab = !(this as any).isCreate && this.tabs.length > 1
                ? restoreRouteQuery<string>('tab', this.$route, this.routeQueryPrefix)
                : undefined;

            if (undefined !== qTab && tab.name === qTab) {
                this.tab = this.tabs.length - 1;
            }
        },

        tabUnregister(tab: StandardViewTab): void {
            if (this.tabs.find((i: any) => i._uid === (tab as any)._uid)) {
                this.tabs = this.tabs.filter((i: any) => i._uid !== (tab as any)._uid);
            }
        },

        setTabCount(tabName: string, count: number|null): void {
            const tab = this.tabs.find((tab: StandardViewTab) => tab.name === tabName);

            if (tab) {
                tab.setCount(count);
                this.watchTabbableMetadatas();
            }
        },

        setTab(tabName: string|null): void {
            if (null === tabName) {
                this.tab = null;
            } else {
                const tabIndex = this.tabs.findIndex((tab: StandardViewTab) => {
                    return tab.name === tabName;
                });

                if (tabIndex >= 0) {
                    this.tab = tabIndex;
                }
            }
        },

        setTabIndex(tabIndex: number|null): void {
            if (null === tabIndex || typeof this.tabs[tabIndex] !== undefined) {
                this.tab = tabIndex;
            }
        },
    },

    watch: {
        metadatas: {
            handler(): void {
                if (this.tabsRef) {
                    this.tabsRef.onResize();
                }
            },
        },

        tab: {
            handler(): void {
                const tab = this.tabs[this.tab ?? -1];

                if (tab) {
                    const genTabIndex = this.genTabs.findIndex((genTab: StandardViewTab) => genTab.name === tab.name);

                    if (genTabIndex >= 0) {
                        this.genTab = genTabIndex;
                    }
                }

                if (this.genTabs.length > 1) {
                    replaceRouteQuery({
                        tab: this.currentTab?.name,
                    }, this.$route, this.routeQueryPrefix);

                    this.$emit('changetab', this.currentTab);
                }
            },
        },

        genTab: {
            handler(): void {
                const tab = this.genTabs[this.genTab ?? -1];

                if (tab) {
                    this.setTab(tab.name);
                }
            },
        },

        /**
         * Watch tabbable data init.
         */
        data: {
            handler(): void {
                // Check if tab is disabled
                if (this.currentTab?.disabled) {
                    // Verify if the tab is really disabled (delay caused by the disabled prop on tab)
                    this.$nextTick(() => {
                        if (this.currentTab?.disabled) {
                            this.setTabIndex(0);
                        }
                    });
                }
            }
        },
    },
});
