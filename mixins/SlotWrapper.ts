/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import {SlotWrapperItem} from '@klipper/bow/slot/SlotWrapperItem';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class SlotWrapper extends Vue {
    public getSlotItems(prefix: string, keepPrefix: boolean = false): SlotWrapperItem[] {
        const items = [];

        for (const slotName of Object.keys(this.$scopedSlots)) {
            if (prefix === slotName || slotName.startsWith(prefix + '.')) {
                const subName = keepPrefix ? slotName : slotName.substring(prefix.length + 1);
                items.push({
                    original: slotName,
                    target: subName ? subName : 'default',
                } as SlotWrapperItem);
            }
        }

        return items;
    }
}
