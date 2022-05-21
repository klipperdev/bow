<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-navigation-drawer
        v-model="drawer"
        fixed
        app
        class="k-app-drawer"
        mobile-breakpoint="920"
        :mini-variant="mini"
        mini-variant-width="80"
        :dark="dark || self.$store.state.darkMode.enabled"
    >
        <template v-slot:prepend>
            <slot
                name="prepend"
                :mini="mini"
                :toggleMini="toggleMini"
            >
                <k-org-switcher-header
                    :mini="mini"
                    @click-mini-drawer="mini = !mini"
                ></k-org-switcher-header>
            </slot>
        </template>

        <v-slide-x-transition
            mode="out-in"
        >
            <v-list
                :key="itemKeyResult"
            >
                <template v-for="(item, i) in items">
                    <v-list-item
                        v-if="getValue(item.heading)"
                        :id="'appDrawerItem_' + self._uid + '_' + i"
                        :key="'item_' + i"
                        class="k-app-drawer--heading text-uppercase"
                    >
                        <v-list-item-content>
                            <v-list-item-subtitle class="primary--text">
                                {{ getValue(item.translatable) ? $t(getValue(item.heading)) : getValue(item.heading) }}
                            </v-list-item-subtitle>
                        </v-list-item-content>

                        <v-tooltip
                            v-if="!tooltipDisabled"
                            :activator="'#appDrawerItem_' + self._uid + '_' + i"
                            right
                            open-delay="120"
                            nudge-right="8"
                            transition="slide-x-transition"
                        >
                            <span>
                                {{ getValue(item.translatable) ? $t(getValue(item.heading)) : getValue(item.heading) }}
                            </span>
                        </v-tooltip>
                    </v-list-item>

                    <v-divider
                        v-else-if="getValue(item.divider)"
                        :key="i"
                        dark
                        class="my-3"
                    ></v-divider>

                    <v-list-item
                        v-else
                        :id="'appDrawerItem_' + self._uid + '_' + i"
                        :key="'item_' + i"
                        class="k-app-drawer--item"
                        :active-class="(getValue(item.color) || 'primary') + ' white--text white--icon'"
                        :ripple="false"
                        :to="getValue(item.route)"
                        :dense="getValue(item.dense)"
                        :exact="getValue(item.exact)"
                        @click.stop="eventClick(item.click)"
                    >
                        <v-list-item-icon>
                            <v-icon
                                :color="getValue(item.color)"
                                :dense="getValue(item.dense)"
                            >
                                {{ getValue(item.icon) }}
                            </v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title
                                :class="getValue(item.textClass)"
                            >
                                {{ getValue(item.translatable) ? $t(getValue(item.text)) : getValue(item.text) }}
                            </v-list-item-title>
                        </v-list-item-content>

                        <v-tooltip
                            v-if="!tooltipDisabled"
                            :activator="'#appDrawerItem_' + self._uid + '_' + i"
                            right
                            open-delay="120"
                            nudge-right="8"
                            transition="slide-x-transition"
                            :color="getValue(item.color) || (self.$store.state.darkMode.enabled ? 'primary darken-2' : 'primary lighten-1')"
                        >
                            <span>
                                {{ getValue(item.translatable) ? $t(getValue(item.text)) : getValue(item.text) }}
                            </span>
                        </v-tooltip>
                    </v-list-item>
                </template>

                <template v-for="slotItem in getSlotItems('list')" v-slot:[slotItem.target]>
                    <slot :name="slotItem.original"/>
                </template>
            </v-list>
        </v-slide-x-transition>

        <template v-slot:append>
            <slot
                name="append"
                :mini="mini"
                :toggleMini="toggleMini"
            />
        </template>

        <template v-for="slotItem in getSlotItems('wrapper')" v-slot:[slotItem.target]>
            <slot :name="slotItem.original"/>
        </template>
    </v-navigation-drawer>
</template>

<style lang="scss" src="./KAppDrawer.scss" />

<script lang="ts">
import {DividerDrawerItem} from '@klipper/bow/drawer/DividerDrawerItem';
import {DrawerItem} from '@klipper/bow/drawer/DrawerItem';
import {HeadingDrawerItem} from '@klipper/bow/drawer/HeadingDrawerItem';
import {TextDrawerItem} from '@klipper/bow/drawer/TextDrawerItem';
import {Selfable} from '@klipper/bow/mixins/Selfable';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {mixins} from 'vue-class-component';
import {Component, Prop, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KAppDrawer extends mixins(
    Selfable,
    SlotWrapper,
) {
    @Prop({type: Boolean, default: true})
    public dark!: boolean;

    @Prop({type: Array})
    public items!: DrawerItem[] | HeadingDrawerItem[] | DividerDrawerItem[] | TextDrawerItem[];

    @Prop({type: String, default: null})
    public itemKey!: string;

    private tooltipDisabled: boolean = false;

    private get itemKeyResult(): string {
        return this.itemKey || JSON.stringify(this.items);
    }

    private get mini(): boolean {
        return this.$store && this.$store.state.drawer ? this.$store.state.drawer.mini : false;
    }

    private set mini(value) {
        if (this.$store) {
            this.$store.commit('drawer/toggleMini', value as boolean);
        }
    }

    private get drawer(): boolean {
        return this.$store && this.$store.state.drawer ? this.$store.state.drawer.show : false;
    }

    private set drawer(value) {
        if (this.$store) {
            this.$store.commit('drawer/toggle', value as boolean);
        }
    }

    public mounted(): void {
        this.watchDrawerMini(this.mini);
    }

    public toggleMini(): void {
        this.mini = !this.mini;
    }

    protected eventClick(callable?: Function): void {
        if (callable) {
            callable();
        }
    }

    private getValue(value: any|Function): any {
        return typeof value === 'function' ? value(this) : value;
    }

    @Watch('mini')
    private watchDrawerMini(mini: boolean): void {
        this.tooltipDisabled = !mini;
    }
}
</script>
