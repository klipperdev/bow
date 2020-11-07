/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {DataTableHeader} from 'vuetify/types';

export interface DataListHeader<T extends any = any> extends DataTableHeader<T> {
    sortPath?: string|string[];
}
