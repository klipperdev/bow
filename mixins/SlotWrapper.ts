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
import Vue from 'vue';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class SlotWrapper extends Vue {
    public getSlotItems(prefix: string, keepPrefix: boolean = false): SlotWrapperItem[] {
        return SlotWrapperHelper.find(this.$scopedSlots, prefix, keepPrefix);
    }
}
