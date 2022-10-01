<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-menu
        v-model="menuOpen"
        v-bind="$attrs"
        v-on="$listeners"
        :close-on-content-click="false"
    >
        <template v-slot:activator="props">
            <slot name="activator" v-bind="props"/>
        </template>

        <v-card v-bind="genMenuCardProps">
            <v-slide-x-reverse-transition mode="out-in">
                <div
                    v-if="!isAction"
                    key="menu"
                    class="k-action-menu--menu"
                >
                    <slot
                        name="menu"
                        v-bind="genSlotProps"
                    />
                </div>

                <div
                    v-else
                    key="action"
                    class="k-action-menu--action"
                >
                    <slot
                        name="action-header"
                        v-bind="genSlotProps"
                    >
                        <div class="k-action-menu--action-header d-flex align-center py-1">
                            <div class="pl-1 py-1">
                                <v-btn
                                    icon
                                    text
                                    color="primary"
                                    @click="previous"
                                >
                                    <v-icon small>
                                        fa-fw fa-chevron-left
                                    </v-icon>
                                </v-btn>
                            </div>

                            <div class="k-action-menu--action-content pl-1 pr-4 py-1 font-weight-bold">
                                <slot
                                    :name="'action-title.' + action"
                                    v-bind="genSlotProps"
                                />
                            </div>
                        </div>
                    </slot>

                    <div class="px-3 pt-2">
                        <slot
                            v-if="$scopedSlots['action.' + action]"
                            :name="'action.' + action"
                            v-bind="genSlotProps"
                        />

                        <slot
                            v-else
                            name="action"
                            v-bind="genSlotProps"
                        />
                    </div>
                </div>
            </v-slide-x-reverse-transition>
        </v-card>
    </v-menu>
</template>

<script lang="ts">
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {defineComponent, PropType} from '@vue/composition-api';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default defineComponent({
    name: 'KActionMenu',

    inheritAttrs: false,

    props: {
        menuCardProps: {
            type: Object as PropType<Dictionary<any>>,
            default: () => ({}),
        },
    },

    data(): Dictionary<any> {
        return {
            menuOpen: false as boolean,
            action: null as string|null,
        };
    },

    computed: {
        genMenuCardProps(): Dictionary<any> {
            return Object.assign({
                'flat': true,
            }, this.menuCardProps);
        },

        genSlotProps(): Dictionary<any> {
            return {
                isAction: this.isAction,
                action: this.action,
                open: this.open,
                close: this.close,
                previous: this.previous,
                next: this.next,
            };
        },

        isAction(): boolean {
            return null !== this.action;
        }
    },

    methods: {
        open(): void {
            this.action = null;
            this.menuOpen = true;
        },

        close(): void {
            this.menuOpen = false;
            this.action = null;
        },

        previous(): void {
            this.action = null;
        },

        next(action: string): void {
            if (this.menuOpen && null === this.action && !!action) {
                this.action = action;
            }
        },
    },

    watch: {
        menuOpen(value: boolean): void {
            if (!value) {
                this.action = null;
            }
        },
    },
});
</script>
