<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KAppDrawer.ts" />

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
            <slot
                name="prepend"
                :mini="mini"
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
                rounded
            >
                <template v-for="(item, i) in items">
                    <v-list-item
                        v-if="getValue(item.heading)"
                        :id="'appDrawerItem_' + _uid + '_' + i"
                        :key="'item_' + i"
                        class="text-uppercase"
                        disabled
                    >
                        <v-list-item-content>
                            <v-list-item-subtitle class="text--disabled">
                                {{ getValue(item.translatable) ? $t(getValue(item.heading)) : getValue(item.heading) }}
                            </v-list-item-subtitle>
                        </v-list-item-content>

                        <v-tooltip
                            :activator="'#appDrawerItem_' + _uid + '_' + i"
                            right
                            open-delay="120"
                            :disabled="tooltipDisabled"
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
                        :id="'appDrawerItem_' + _uid + '_' + i"
                        :key="'item_' + i"
                        :active-class="(item.color || 'primary') + ' white--text white--icon'"
                        :ripple="false"
                        :to="getValue(item.route)"
                        :dense="getValue(item.dense)"
                        :exact="getValue(item.exact)"
                        @click.stop="eventClick(item.click)"
                    >
                        <v-list-item-icon>
                            <v-icon
                                :color="$color(getValue(item.color))"
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
                            :activator="'#appDrawerItem_' + _uid + '_' + i"
                            right
                            open-delay="120"
                            :disabled="tooltipDisabled"
                            nudge-right="8"
                            transition="slide-x-transition"
                            :color="item.color || ($store.state.darkMode.enabled ? 'primary lighten-2' : 'primary lighten-1')"
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

        <template v-for="slotItem in getSlotItems('drawer')" v-slot:[slotItem.target]>
            <slot :name="slotItem.original"/>
        </template>
    </v-navigation-drawer>
</template>
