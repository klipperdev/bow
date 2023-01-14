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
import {ListRequestConfig} from '@klipper/sdk/requests/ListRequestConfig';
import {deepMerge} from '@klipper/bow/utils/object';

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

    public buildRequestConfig(config?: ListRequestConfig): ListRequestConfig {
        return deepMerge<ListRequestConfig>({
            method: 'GET',
            limit: this.limit,
            page: this.page,
            search: this.search || undefined,
            searchFields: this.searchFields || undefined,
            sort: this.sort,
            filter: this.filters || undefined,
            fields: this.fields || undefined,
            viewsDetails: this.viewsDetails || undefined,
        }, config || {});
    }
}
