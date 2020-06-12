<!--
This file is part of the Tug package.

(c) François Pluchino <francois.pluchino@gmail.com>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-app-bar app elevate-on-scroll :scroll-target.sync="scrollTarget">
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

        <slot name="title"></slot>

        <slot name="default">
            <v-spacer></v-spacer>
        </slot>

        <slot name="online-status">
            <k-online-status></k-online-status>
        </slot>

        <slot name="actions"></slot>
    </v-app-bar>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    /**
     * @author François Pluchino <francois.pluchino@gmail.com>
     */
    @Component
    export default class KToolbar extends Vue {
        public showPreviousButton: boolean = false;

        private unSyncRouterHook?: Function;

        private scrollTarget: string|null = null;

        public created(): void {
            const self = this;

            if (this.$routerBack) {
                this.showPreviousButton = !this.$routerBack.isRoot();

                this.unSyncRouterHook = this.$router.afterEach(() => {
                    self.showPreviousButton = !self.$routerBack.isRoot();
                });
            }
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
    }
</script>