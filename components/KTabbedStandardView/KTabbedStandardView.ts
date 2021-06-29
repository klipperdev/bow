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
import {StandardMasterComponent} from '@klipper/bow/mixins/StandardMasterComponent';
import {StandardViewTab} from '@klipper/bow/standardView/StandardViewTab';
import {replaceRouteQuery, restoreRouteQuery} from '@klipper/bow/utils/router';
import {mixins} from 'vue-class-component';
import {Component, Prop, Ref, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KTabbedStandardView extends mixins(
    StandardMasterComponent,
    RegistrableProvide('standardViewTabItem', false, 'tabRegister', 'tabUnregister'),
) {
    @Prop({type: Boolean, default: false})
    public loader!: boolean;

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

    @Ref('tabs')
    private tabsRef: Vue|any;

    protected get displayCreate(): boolean {
        return this.isCreate && !!this.$scopedSlots.create;
    }

    protected get metadatas(): Dictionary<ObjectMetadata> {
        return this.$store.state.metadata.metadatas;
    }

    private get currentTab(): StandardViewTab|undefined {
        return this.tabs[this.tab ?? -1] ?? undefined;
    }

    private get genTabs(): StandardViewTab[] {
        if (!this.isCreate) {
            return this.tabs;
        }

        return this.tabs.filter((tab: StandardViewTab) => {
            return tab.isCreatable;
        });
    }

    private get bindSlotData(): any {
        return Object.assign({
            showError: this.showError,
            loader: this.loader,
            tabsCentered: this.tabsCentered,
            tabsRight: this.tabsRight,
            tabsFluid: this.tabsFluid,
            headingFluid: this.headingFluid,
            tabs: this.tabs,
            currentTab: this.currentTab,
            setTabIndex: this.setTabIndex,
            setTabCount: this.setTabCount,
        }, this.genSlotProps);
    }

    public tabRegister(tab: StandardViewTab): void {
        this.tabs.push(tab);

        const qTab = restoreRouteQuery<string>('tab', this.$route, this.routeQueryPrefix);

        if (undefined !== qTab && tab.name === qTab && (false === (tab.disabled as boolean|string))) {
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
            this.watchMetadatas();
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
    private watchMetadatas(): void {
        if (this.tabsRef) {
            this.tabsRef.onResize();
        }
    }

    @Watch('tab')
    private watchTab(): void {
        replaceRouteQuery({
            tab: this.currentTab?.name ?? undefined,
        }, this.$route, this.routeQueryPrefix);

        this.$emit('changetab', this.currentTab);
    }
}
