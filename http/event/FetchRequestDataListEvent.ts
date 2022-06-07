/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Canceler} from '@klipper/http-client/Canceler';
import {FilterResult} from '@klipper/sdk/models/filters/FilterResult';
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

    public searchFields: string[]|null = null;

    public viewsDetails: boolean|null = null;

    public filters: FilterResult = null;

    public fields: string[]|null = null;

    public canceler?: Canceler;
}
