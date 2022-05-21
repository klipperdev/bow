<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-app-bar
        app
        :extension-height.sync="extensionHeight"
        elevate-on-scroll
        :scroll-target.sync="scrollTarget"
        scroll-threshold="5"
        :hide-on-scroll="hideOnScroll"
        class="v-app-bar--transparent-on-top"
    >
        <slot
            name="menu"
        >
            <v-app-bar-nav-icon
                v-if="!showPreviousButton"
                @click.prevent="drawerButtonAction"
                key="menu-btn"
                class="mr-2"
                color="blue-grey"
            >
                <v-icon small>fa-fw fa-stream</v-icon>
            </v-app-bar-nav-icon>

            <v-btn
                v-else
                icon
                @click.prevent="previousButtonAction"
                @long-click="drawerButtonAction"
                key="previous-btn"
                class="mr-2"
                color="blue-grey"
            >
                <v-icon small>fa-fw fa-arrow-left</v-icon>
            </v-btn>
        </slot>

        <slot
            name="title"
        >
            <v-toolbar-title
                v-if="!!title"
                :key="title"
            >
                {{ title }}
            </v-toolbar-title>
        </slot>

        <slot
            name="default"
        >
            <v-spacer />
        </slot>

        <slot
            name="online-status"
        >
            <k-online-status
                class="mr-4"
            ></k-online-status>
        </slot>

        <slot
            name="actions"
        >
            <v-btn
                icon
                class="mr-2 d-none d-md-flex"
                :to="{name: 'settings', params: {'org': self.$org}}"
                color="blue-grey"
            >
                <v-icon>fa-fw fa-cog</v-icon>
            </v-btn>
        </slot>

        <slot
            name="profile-menu"
        >
            <k-profile-menu />
        </slot>

        <template v-for="slotItem in getSlotItems('app-bar')" v-slot:[slotItem.target]>
            <slot :name="slotItem.original"/>
        </template>
    </v-app-bar>
</template>

<script lang="ts">
import {Selfable} from '@klipper/bow/mixins/Selfable';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';
import {Route} from 'vue-router';

/**
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KToolbar extends mixins(
    Selfable,
    SlotWrapper,
) {
    @Prop({type: [Number, String]})
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
                        ? this.$t(this.getRouteTitleValue(to.matched[i].meta.appBar.title)) as string
                        : this.getRouteTitleValue(to.matched[i].meta.appBar.title);
                }
            }

        }

        if (!!to.meta && to.meta.appBar && to.meta.appBar.title) {
            return to.meta.appBar.translatable
                ? this.$t(this.getRouteTitleValue(to.meta.appBar.title)) as string
                : this.getRouteTitleValue(to.meta.appBar.title);
        }

        return null;
    }

    private getRouteTitleValue(title: string|Function): string {
        if (typeof title === 'function') {
            return title(this.$root);
        }

        return title;
    }
}
</script>
