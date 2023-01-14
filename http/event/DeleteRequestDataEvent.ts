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
import {DeleteRequestConfig} from '@klipper/sdk/requests/DeleteRequestConfig';
import {Dictionary} from '@klipper/bow/generic/Dictionary';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class DeleteRequestDataEvent extends AbstractRequestDataEvent {
    public id: string|number;

    public buildRequestConfig<C = DeleteRequestConfig, RP = any>(config?: C, requestParams?: Dictionary<RP>): C {
        return super.buildRequestConfig(deepMerge<C>({
            method: 'DELETE',
        } as any, config || {}), requestParams) as C;
    }
}
