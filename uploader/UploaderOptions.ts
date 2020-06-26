/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {MapKey} from '@klipper/http-client/models/MapKey';
import {Locale} from '@uppy/core';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface UploaderOptions {
    locales?: MapKey<Locale>;
    debug?: boolean;
}
