/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';
import {FetchRequestDataEvent} from '../event/FetchRequestDataEvent';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export type FetchRequestDataFunction<I = object> = (event: FetchRequestDataEvent) => Promise<ListResponse<I>>;