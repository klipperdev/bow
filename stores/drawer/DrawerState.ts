/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {DrawerContextItems} from '@klipper/bow/drawer/DrawerContextItems';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface DrawerState<C extends DrawerContextItems = DrawerContextItems> {
    mini: boolean;
    show: boolean;
    context: string;
    contextItems: C;
}
