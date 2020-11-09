/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {VNode} from 'vue';
import {Dictionary} from '@klipper/bow/generic/Dictionary';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
declare module 'vue/types/vue' {
    interface Vue {
        $findScopedSlots: ($scopedSlots: Dictionary<(props: any) => VNode[]|undefined>|undefined|any, prefix: string, keepPrefix: boolean = false) => Dictionary<string>;
    }
}
