/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {StandardViewItem} from '@klipper/bow/standardView/StandardViewItem';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface StandardViewTab extends StandardViewItem {
    label: string;
    name: string;
    count: number|null;
    disabled: boolean;
    isCountable: boolean;
    isCreatable: boolean;
    genCount: number|null;
    setCount(count: number|null): void;
}
