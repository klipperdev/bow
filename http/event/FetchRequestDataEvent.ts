/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Canceler} from '@klipper/http-client/Canceler';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class FetchRequestDataEvent {
    public id: string;

    public canceler?: Canceler;
}
