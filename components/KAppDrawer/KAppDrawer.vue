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
            mobile-breakpoint="920"
            :mini-variant.sync="mini"
            mini-variant-width="72"
    >
        <template v-slot:prepend>
            <slot name="prepend" :mini="mini">
                <k-org-switcher-header
                        @click-mini-drawer="mini = !mini"
                        :mini="mini"
                ></k-org-switcher-header>
            </slot>
        </template>

        <v-slide-x-transition mode="out-in">
            <v-list rounded :key="itemKeyResult">
                <template v-for="(item, i) in items">
                    <v-list-item
                        v-if="item.heading"
                        :id="'appDrawerItem_' + _uid"
                        :key="'item_' + i"
                    >
                        <v-list-item-content>
                            <v-list-item-subtitle>
                                {{ item.translatable ? $t(item.heading) : item.heading }}
                            </v-list-item-subtitle>
                        </v-list-item-content>

                        <v-tooltip :activator="'#appDrawerItem_' + _uid"
                                   right
                                   open-delay="120"
                                   :disabled="!mini"
                                   nudge-right="8"
                                   eager
                                   transition="slide-x-transition"
                        >
                            <span>{{ item.translatable ? $t(item.heading) : item.heading }}</span>
                        </v-tooltip>
                    </v-list-item>

                    <v-divider
                            v-else-if="item.divider"
                            :key="i"
                            dark
                            class="my-3"
                    ></v-divider>

                    <v-list-item
                        v-else
                        :id="'appDrawerItem_' + _uid"
                        :key="'item_' + i"
                        active-class="primary white--text white--icon"
                        :ripple="false"
                        :to="item.route"
                        :dense="item.dense"
                        @click.stop="eventClick(item.click)"
                    >
                        <v-list-item-icon>
                            <v-icon :color="$color(item.color)"
                                    :dense="item.dense"
                            >{{ item.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title :class="item.textClass">
                                {{ item.translatable ? $t(item.text) : item.text }}
                            </v-list-item-title>
                        </v-list-item-content>

                        <v-tooltip :activator="'#appDrawerItem_' + _uid"
                                   right
                                   open-delay="120"
                                   :disabled="!mini"
                                   nudge-right="8"
                                   eager
                                   transition="slide-x-transition"
                                   :color="$store.state.darkMode.enabled ? 'primary lighten-2' : 'primary lighten-1'"
                        >
                            <span>{{ item.translatable ? $t(item.text) : item.text }}</span>
                        </v-tooltip>
                    </v-list-item>
                </template>

                <template v-for="(slotItem) in getSlotItems('list')"
                          v-slot:[slotItem.target]>
                    <slot :name="slotItem.original"></slot>
                </template>
            </v-list>
        </v-slide-x-transition>

        <template v-for="(slotItem) in getSlotItems('drawer')"
                  v-slot:[slotItem.target]>
            <slot :name="slotItem.original"></slot>
        </template>
    </v-navigation-drawer>
</template>

<script lang="ts">
    import {Component, Prop} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
    import {DrawerItem} from '@klipper/bow/drawer/DrawerItem';
    import {HeadingDrawerItem} from '@klipper/bow/drawer/HeadingDrawerItem';
    import {DividerDrawerItem} from '@klipper/bow/drawer/DividerDrawerItem';
    import {TextDrawerItem} from '@klipper/bow/drawer/TextDrawerItem';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KAppDrawer extends mixins(SlotWrapper) {
        @Prop({type: Array})
        public items!: DrawerItem[]|HeadingDrawerItem[]|DividerDrawerItem[]|TextDrawerItem[];

        @Prop({type: String, default: null})
        public itemKey!: string;

        public get itemKeyResult(): string {
            return this.itemKey || JSON.stringify(this.items);
        }

        public get mini(): boolean {
            return this.$store && this.$store.state.drawer ? this.$store.state.drawer.mini : false;
        }

        public set mini(value) {
            if (this.$store) {
                this.$store.commit('drawer/toggleMini', value as boolean);
            }
        }

        public get drawer(): boolean {
            return this.$store && this.$store.state.drawer ? this.$store.state.drawer.show : false;
        }

        public set drawer(value) {
            if (this.$store) {
                this.$store.commit('drawer/toggle', value as boolean);
            }
        }

        public eventClick(callable?: Function): void {
            if (callable) {
                callable();
            }
        }
    }
</script>
