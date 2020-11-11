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

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export type PushRequestDataFunction<D = Dictionary<any>, R = Dictionary<any>> = (event: PushRequestDataEvent<D>) => Promise<R|null>;
