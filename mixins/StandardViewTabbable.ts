/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {ObjectMetadata} from '@klipper/bow/metadata/ObjectMetadata';
import {provide as RegistrableProvide} from '@klipper/bow/mixins/Registrable';
import {StandardViewTab} from '@klipper/bow/standardView/StandardViewTab';
import {replaceRouteQuery, restoreRouteQuery} from '@klipper/bow/utils/router';
import {mixins} from 'vue-class-component';
import {Component, Prop, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class StandardViewTabbable extends mixins(
    RegistrableProvide('standardViewTab', false, 'tabRegister', 'tabUnregister'),
) {
    @Prop({type: Boolean, default: false})
    public tabsCentered!: boolean;

    @Prop({type: Boolean, default: false})
    public tabsRight!: boolean;

    @Prop({type: Boolean, default: false})
    public tabsFluid!: boolean;

    @Prop({type: Boolean, default: false})
    public headingFluid!: boolean;

    @Prop({type: String})
    public routeQueryPrefix!: string;

    @Prop({type: Object, default: () => {
        return {};
    }})
    public tabsProps!: Dictionary<any>;

    protected tabs: StandardViewTab[] = [];

    protected tab: number|null = null;

    protected tabsRef: Vue|any;

    protected get metadatas(): Dictionary<ObjectMetadata> {
        return this.$store.state.metadata.metadatas;
    }

    protected get currentTab(): StandardViewTab|undefined {
        return this.tabs[this.tab ?? -1] ?? undefined;
    }

    protected get genTabs(): StandardViewTab[] {
        if (!(this as any).isCreate) {
            return this.tabs;
        }

        return this.tabs.filter((tab: StandardViewTab) => {
            return tab.isCreatable;
        });
    }

    protected get genTabbableBindSlotData(): any {
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
    }

    public tabRegister(tab: StandardViewTab): void {
        this.tabs.push(tab);

        const qTab = this.tabs.length > 1
            ? restoreRouteQuery<string>('tab', this.$route, this.routeQueryPrefix)
            : 'details';

        if (undefined !== qTab && tab.name === qTab) {
            this.tab = this.tabs.length - 1;
        }
    }

    public tabUnregister(tab: StandardViewTab): void {
        if (this.tabs.find((i: any) => i._uid === (tab as any)._uid)) {
            this.tabs = this.tabs.filter((i: any) => i._uid !== (tab as any)._uid);
        }
    }

    public setTabCount(tabName: string, count: number|null) {
        const tab = this.tabs.find((tab) => tab.name === tabName);

        if (tab) {
            tab.setCount(count);
            this.watchTabbableMetadatas();
        }
    }

    public setTab(tabName: string|null): void {
        if (null === tabName) {
            this.tab = null;
        } else {
            const tabIndex = this.tabs.findIndex((tab) => {
                return tab.name === tabName;
            });

            if (tabIndex >= 0) {
                this.tab = tabIndex;
            }
        }
    }

    public setTabIndex(tabIndex: number|null): void {
        if (null === tabIndex || typeof this.tabs[tabIndex] !== undefined) {
            this.tab = tabIndex;
        }
    }

    @Watch('metadatas')
    protected watchTabbableMetadatas(): void {
        if (this.tabsRef) {
            this.tabsRef.onResize();
        }
    }

    @Watch('tab')
    protected watchTabbableTab(): void {
        if (this.tabs.length > 1) {
            replaceRouteQuery({
                tab: this.currentTab?.name,
            }, this.$route, this.routeQueryPrefix);

            this.$emit('changetab', this.currentTab);
        }
    }

    @Watch('data')
    protected watchTabbableDataInit(): void {
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
}
