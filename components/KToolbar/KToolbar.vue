<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-app-bar app
               :extension-height.sync="extensionHeight"
               elevate-on-scroll
               :scroll-target.sync="scrollTarget"
               scroll-threshold="20"
               :hide-on-scroll="hideOnScroll"
               class="v-app-bar--transparent-on-top"
    >
        <slot name="menu">
            <v-scale-transition origin="center center" mode="out-in">
                <v-app-bar-nav-icon v-if="!showPreviousButton"
                                    @click.prevent="drawerButtonAction"
                                    key="menu-btn" class="mr-2"
                >
                    <v-icon>menu</v-icon>
                </v-app-bar-nav-icon>

                <v-btn v-else
                       icon
                       @click.prevent="previousButtonAction"
                       @long-click="drawerButtonAction"
                       key="previous-btn"
                       class="mr-2"
                >
                    <v-icon>arrow_back</v-icon>
                </v-btn>
            </v-scale-transition>
        </slot>

        <slot name="title">
            <v-slide-y-transition>
                <v-toolbar-title v-if="!!title">
                    {{ title }}
                </v-toolbar-title>
            </v-slide-y-transition>
        </slot>

        <slot name="default">
            <v-spacer></v-spacer>
        </slot>

        <slot name="online-status">
            <k-online-status class="mr-4"></k-online-status>
        </slot>

        <slot name="actions"></slot>

        <slot name="profile-menu">
            <k-profile-menu></k-profile-menu>
        </slot>

        <template v-for="(slotItem) in getSlotItems('app-bar')"
                  v-slot:[slotItem.target]>
            <slot :name="slotItem.original"></slot>
        </template>
    </v-app-bar>
</template>

<script lang="ts">
    import {Component, Prop} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {Route} from 'vue-router';
    import {SlotWrapper} from '../../slot/mixins/SlotWrapper';

    /**
     *
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KToolbar extends mixins(SlotWrapper) {
        @Prop({type: Number|String})
        public extensionHeight?: number|string;

        @Prop({type: Boolean, default: false})
        public hideOnScroll: boolean;

        public showPreviousButton: boolean = false;

        public title: string|null = null;

        private unSyncRouterHook?: Function;

        private scrollTarget: string|null = null;

        public beforeCreate(): void {
            this.$router.afterEach((to: Route) => {
                this.title = this.getRouteTitle(to);
            });
        }

        public created(): void {
            const self = this;

            if (this.$routerBack) {
                this.showPreviousButton = !this.$routerBack.isRoot();

                this.unSyncRouterHook = this.$router.afterEach(() => {
                    self.showPreviousButton = !self.$routerBack.isRoot();
                });
            }
        }

        public updated(): void {
            this.title = this.getRouteTitle(this.$route);
        }

        public mounted(): void {
            this.scrollTarget = 'body > .os-padding > .os-viewport';
        }

        public beforeDestroy(): void {
            if (this.unSyncRouterHook) {
                this.unSyncRouterHook();
                this.unSyncRouterHook = undefined;
            }
        }

        public drawerButtonAction(): void {
            this.$store.commit('drawer/toggle');
        }

        public async previousButtonAction(): Promise<void> {
            if (this.$routerBack) {
                await this.$routerBack.back();
            }
        }

        private getRouteTitle(to: Route): string|null {
            if (to.matched.length > 0) {
                for (let i = to.matched.length - 1; i >= 0; --i) {
                    if (to.matched[i].meta.appBar && to.matched[i].meta.appBar.title) {
                        return to.matched[i].meta.appBar.translatable
                            ? this.$t(to.matched[i].meta.appBar.title)
                            : tto.matched[i].meta.appBar.title;
                    }
                }

            }

            if (to.meta.appBar && to.meta.appBar.title) {
                return to.meta.appBar.translatable
                    ? this.$t(to.meta.appBar.title)
                    : to.meta.appBar.title;
            }

            return null;
        }
    }
</script>
