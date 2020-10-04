/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {PushRequestDataEvent} from '@klipper/bow/http/event/PushRequestDataEvent';
import {MapKey} from '@klipper/http-client/models/MapKey';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export type PushRequestDataFunction<D = MapKey, R = MapKey> = (event: PushRequestDataEvent<D>) => Promise<R|null>;
