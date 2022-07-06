<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div
        v-bind="$attrs"
        v-on="$listeners"
        class="k-context-menu"
    >
        <slot
            name="menu-wrapper"
            v-bind="genSlotProps"
        >
            <v-menu
                v-model="showContextMenu"
                v-bind="genMenuProps"
            >
                <slot
                    name="menu"
                    v-bind="genSlotProps"
                />
            </v-menu>
        </slot>

        <slot
            name="default"
            v-bind="genSlotProps"
        />
    </div>
</template>

<script lang="ts">
import {PointerContextMenu} from '@klipper/bow/composables/mixins/pointerContextMenu';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {defineComponent, PropType} from '@vue/composition-api';
import {VNode} from 'vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default defineComponent({
    name: 'KContextMenu',

    mixins: [
        PointerContextMenu,
    ],

    props: {
        disabled: {
            type: Boolean,
        },

        menuProps: {
            type: Object as PropType<Dictionary<any>>,
            default: () => ({}),
        },
    },

    computed: {
        genSlotProps(): Dictionary<any> {
            return {
                item: this.contextMenuItem,
                menuX: this.contextMenuX,
                menuY: this.contextMenuY,
                menuProps: this.genMenuProps,
                showMenu: this.showContextMenu,
                onContextMenu: this.onContextMenu,
                open: this.open,
                close: this.close,
            };
        },

        genMenuProps(): Dictionary<any> {
            return Object.assign({
                'position-x': this.contextMenuX,
                'position-y': this.contextMenuY,
                'disabled': this.disabled,
                'absolute': true,
                'offset-y': true,
            }, this.menuProps);
        },
    },

    methods: {
        open(): void {
            this.showContextMenu = true;
        },

        close(): void {
            this.showContextMenu = false;
        }
    },
});
</script>
