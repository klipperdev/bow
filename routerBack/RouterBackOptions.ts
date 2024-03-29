/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {RawLocation} from 'vue-router';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface RouterBackOptions {
    forceHistory?: boolean;
    useRedirectQuery?: boolean;
    rootRoute?: RawLocation;
}
