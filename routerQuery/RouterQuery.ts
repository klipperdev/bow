/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import VueRouter, {Location} from 'vue-router';
import {RouterQueryKeys} from '@klipper/bow/routerQuery/RouterQueryKeys';
import {mergeRouteQueryValues} from '@klipper/bow/utils/router';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class RouterQuery {
    private readonly router: VueRouter;

    public constructor(router: VueRouter) {
        this.router = router;
    }

    /**
     * Add record field values in route query parameters.
     */
    public add(route: Location, query?: RouterQueryKeys, prefix?: string, redirect: boolean = false): Location {
        if (query) {
            mergeRouteQueryValues(query, route, prefix);
        }

        if (redirect) {
            this.addRedirect(route);
        }

        return route;
    }

    public addRedirect(route: Location): Location {
        if (this.router.currentRoute) {
            route.query = route.query || {};
            route.query.redirect = encodeURIComponent(this.router.currentRoute.fullPath);
        }

        return route;
    }
}
