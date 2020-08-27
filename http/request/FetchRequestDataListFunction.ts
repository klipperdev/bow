/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';
import {FetchRequestDataListEvent} from '@klipper/bow/http/event/FetchRequestDataListEvent';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export type FetchRequestDataListFunction<I = object> = (event: FetchRequestDataListEvent) => Promise<ListResponse<I>>;
