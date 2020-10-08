/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Canceler} from '@klipper/http-client/Canceler';
import {MapKey} from '@klipper/http-client/models/MapKey';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export abstract class AbstractRequestDataEvent {
    public locale?: string;

    public canceler?: Canceler;

    public getRequestParams<T = any>(params?: MapKey<T>): MapKey<T> {
        const localeParams = this.locale ? {lang: this.locale} : {};

        return Object.assign({}, params || {}, localeParams) as MapKey<T>;
    }
}
