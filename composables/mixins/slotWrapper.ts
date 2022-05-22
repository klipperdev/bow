/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {SlotWrapper as SlotWrapperHelper} from '@klipper/bow/slot/SlotWrapper';
import {SlotWrapperItem} from '@klipper/bow/slot/SlotWrapperItem';
import Vue, {ComponentOptions} from 'vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export const SlotWrapper: ComponentOptions<Vue|any> = {
    name: 'slotWrapper',

    methods: {
        getSlotItems(prefix: string, keepPrefix: boolean = false): SlotWrapperItem[] {
            return SlotWrapperHelper.find(this.$scopedSlots, prefix, keepPrefix);
        },
    },
};
