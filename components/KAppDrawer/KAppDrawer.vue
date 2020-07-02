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
        </template>

        <v-list rounded>
            <template v-for="(item, i) in items">
                <v-list-item v-if="item.heading" :key="i">
                    <v-list-item-content>
                        <v-list-item-subtitle>
                            {{ item.translatable ? $t(item.heading) : item.heading }}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-divider
                        v-else-if="item.divider"
                        :key="i"
                        dark
                        class="my-3"
                ></v-divider>

                <v-tooltip v-else
                           right
                           open-delay="120"
                           :disabled="!mini"
                           nudge-right="8"
                           eager
                           transition="slide-x-transition"
                           :color="$store.state.darkMode.enabled ? 'primary lighten-2' : 'primary lighten-1'"
                           :key="i"
                >
                    <template v-slot:activator="{on, attrs}">
                        <v-list-item
                                v-on="on"
                                active-class="primary white--text white--icon"
                                :ripple="false"
                                :key="i"
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
                        </v-list-item>
                    </template>
                    <span>{{ item.translatable ? $t(item.text) : item.text }}</span>
                </v-tooltip>
            </template>

            <template v-for="(slotItem) in getSlotItems('list')"
                      v-slot:[slotItem.target]>
                <slot :name="slotItem.original"></slot>
            </template>
        </v-list>

        <template v-for="(slotItem) in getSlotItems('drawer')"
                  v-slot:[slotItem.target]>
            <slot :name="slotItem.original"></slot>
        </template>
    </v-navigation-drawer>
</template>

<script lang="ts">
    import {Component, Prop} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {SlotWrapper} from '../../slot/mixins/SlotWrapper';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component({
        components: {},
    })
    export default class KAppDrawer extends mixins(SlotWrapper) {
        @Prop(Array)
        public items!: object[];

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
