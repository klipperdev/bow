/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {FilterResult} from '@klipper/sdk/models/filters/FilterResult';
import {Sort} from '@klipper/sdk/requests/Sort';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface FetchedEventDataList<I = Dictionary<any>> {
    items: I[],
    page: number,
    limit: number,
    pages: number,
    total: number,
    search: string|null,
    searchFields: string[],
    viewsDetails: boolean,
    filters: FilterResult,
    fields: string[],
    sort: Sort[],
}
