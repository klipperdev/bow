/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AbstractRequestDataEvent} from '@klipper/bow/http/event/AbstractRequestDataEvent';
import {RequestConfigType} from '@klipper/sdk/requests/RequestConfigTypes';
import {deepMerge} from '@klipper/bow/utils/object';
import {Dictionary} from '@klipper/bow/generic/Dictionary';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class FetchRequestDataEvent extends AbstractRequestDataEvent {
    public id: string|number|undefined;

    public fields: string[]|null = null;

    public viewsDetails: boolean|null = null;

    public buildRequestConfig<C = RequestConfigType, RP = any>(config?: C, requestParams?: Dictionary<RP>): C {
        return super.buildRequestConfig(deepMerge<C>({
            method: 'GET',
            fields: this.fields || undefined,
            viewsDetails: this.viewsDetails || undefined,
        } as any, config || {}), requestParams) as C;
    }
}
