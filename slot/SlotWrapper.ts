/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {VNode} from 'vue';
import {SlotWrapperItem} from '@klipper/bow/slot/SlotWrapperItem';

export abstract class SlotWrapper {
    public static find($scopedSlots: Record<string, (props: any) => VNode[]|undefined>|undefined|any, prefix: string, keepPrefix: boolean = false): SlotWrapperItem[] {
        const items = [];

        if ($scopedSlots) {
            for (const slotName of Object.keys($scopedSlots)) {
                if (prefix === slotName || slotName.startsWith(prefix + '.') || '' === prefix) {
                    const subName = keepPrefix || '' === prefix ? slotName : slotName.substring(prefix.length + 1);
                    items.push({
                        original: slotName,
                        target: subName ? subName : 'default',
                    } as SlotWrapperItem);
                }
            }
        }

        return items;
    }
}
