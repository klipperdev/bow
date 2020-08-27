/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {DrawerItem} from '@klipper/bow/drawer/DrawerItem';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class DividerDrawerItem implements DrawerItem {
    public readonly divider: boolean = true;
}
