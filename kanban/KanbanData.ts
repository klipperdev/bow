/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {FetchRequestDataListFunction} from '@klipper/bow/http/request/FetchRequestDataListFunction';
import {FilterResult} from '@klipper/sdk/models/filters/FilterResult';
import {Sort} from '@klipper/sdk/requests/Sort';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface KanbanData {
    itemKey: string;
    limit: number;
    searchFields: string[];
    disableSearch: boolean;
    sort: Sort|Sort[]|string|string[]|null;
    filters: FilterResult;
    viewsDetails: boolean;
    fetchRequest: FetchRequestDataListFunction|null;
    topOnRefresh: boolean;
    routeQuery: boolean;
    routeQueryPrefix: string|null;
}
