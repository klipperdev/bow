/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Location} from 'vue-router';
import {RouterQueryKeys} from '@klipper/bow/routerQuery/RouterQueryKeys';
import {mergeRouteQueryValues} from '@klipper/bow/utils/router';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class RouterQuery {
    /**
     * Add record field values in route query parameters.
     */
    public add<T = any>(route: Location, query: RouterQueryKeys, prefix?: string): Location {
        mergeRouteQueryValues(query, route, prefix);

        return route;
    }
}
