/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {StandardPushRequestDataEvent} from '@klipper/bow/http/event/StandardPushRequestDataEvent';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export type StandardPushRequestDataFunction<D = Dictionary<any>, T = Dictionary<any>, R = Dictionary<any>> = (event: StandardPushRequestDataEvent<D, T>) => Promise<R|null>;
