/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Canceler} from '@klipper/http-client/Canceler';
import {FilterCondition} from '@klipper/sdk/models/filters/FilterCondition';
import {FilterRule} from '@klipper/sdk/models/filters/FilterRule';
import {Sort} from '@klipper/sdk/requests/Sort';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class FetchRequestDataListEvent {
    public page: number = 1;

    public limit: number = 20;

    public pages: number = -1;

    public total: number = 0;

    public sort: Sort|Sort[]|string|string[]|undefined = undefined;

    public search: string|null = null;

    public filters: FilterCondition|FilterRule|null = null;

    public canceler?: Canceler;
}
