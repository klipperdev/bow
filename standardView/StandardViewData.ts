/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {HttpClientRequestError} from '@klipper/http-client/errors/HttpClientRequestError';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface StandardViewData {
    metadata: string|null;
    currentLocale: string;
    editMode: boolean;
    loading: boolean;
    data: Dictionary<any>|null;
    pushAction: () => Promise<void>;
    error: HttpClientRequestError|null;
}