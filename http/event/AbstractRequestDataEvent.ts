/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {Canceler} from '@klipper/http-client/Canceler';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export abstract class AbstractRequestDataEvent {
    public locale?: string;

    public canceler?: Canceler;

    public getRequestParams<T = any>(params?: Dictionary<T>): Dictionary<T> {
        const localeParams = this.locale ? {lang: this.locale} : {};

        return Object.assign({}, params || {}, localeParams) as Dictionary<T>;
    }
}
