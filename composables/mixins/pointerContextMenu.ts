/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {isCssColor} from '@klipper/bow/utils/color';
import Vue, {PropType} from 'vue';
import {DefaultData} from 'vue/types/options';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
interface Data {
    contextMenuItem: Dictionary<any>|null;
    contextMenuX: number;
    contextMenuY: number;
}

interface Computed {
    get showContextMenu(): boolean;
    set showContextMenu(value: boolean);
}

interface Methods {
    onContextMenu(e: PointerEvent, item: Dictionary<any>): void;
}

export const PointerContextMenu = Vue.extend<Data, Methods, Computed>({
    name: 'PointerContextMenu',

    data() {
        return {
            contextMenuItem: null as Dictionary<any>|null,
            contextMenuX: 0,
            contextMenuY: 0,
        };
    },

    computed: {
        showContextMenu: {
            get(): boolean {
                return !!this.contextMenuItem;
            },

            set(value: boolean) {
                if (!value) {
                    this.contextMenuItem = null;
                }
            }
        },
    },

    methods: {
        onContextMenu(e: PointerEvent, item: Dictionary<any>): void {
            e.preventDefault();
            this.contextMenuX = e.clientX;
            this.contextMenuY = e.clientY;

            this.$nextTick(() => {
                this.contextMenuItem = item;
            });
        },
    },
});
