/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {PushRequestDataEvent} from '@klipper/bow/http/event/PushRequestDataEvent';
import {ObjectMetadata} from '@klipper/bow/metadata/ObjectMetadata';
import {RequestConfigType} from '@klipper/sdk/requests/RequestConfigTypes';
import {deepMerge} from '@klipper/bow/utils/object';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class StandardPushRequestDataEvent<D = Dictionary<any>, T = Dictionary<any>> extends PushRequestDataEvent<D> {
    public currentLocale: string;

    public objectMetadata: ObjectMetadata|undefined;

    public dataTransformed: T;

    public buildRequestConfig<C = RequestConfigType, RP = any>(config?: C, requestParams?: Dictionary<RP>): C {
        return super.buildRequestConfig(deepMerge<C>({
            data: this.dataTransformed,
        } as any, config || {}), requestParams) as C;
    }
}
