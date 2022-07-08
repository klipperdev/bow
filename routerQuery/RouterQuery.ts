/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {RouterQueryKeys} from '@klipper/bow/routerQuery/RouterQueryKeys';
import {mergeRouteQueryValues} from '@klipper/bow/utils/router';
import VueRouter, {Location, RawLocation} from 'vue-router';

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

    public addRedirect(route: Location, keepUrlRedirect: boolean = false): Location {
        if (this.router.currentRoute) {
            // Prefer to use window location that the Route.fullPath value to get the latest edited queries
            const queryParams = new URLSearchParams(window.location.search);
            const search = '?' + queryParams.toString();
            const fullPath = this.router.currentRoute.path + ('?' === search ? '' : search);

            route.query = route.query || {};

            if (keepUrlRedirect && typeof this.router?.currentRoute?.query.redirect === 'string') {
                route.query.redirect = this.router.currentRoute.query.redirect;
            } else {
                route.query.redirect = encodeURIComponent(fullPath);
            }
        }

        return route;
    }

    public getRedirect(fallbackRoute: RawLocation): RawLocation {
        if (typeof this.router?.currentRoute?.query.redirect === 'string') {
            return decodeURIComponent(this.router.currentRoute.query.redirect);
        }

        return fallbackRoute;
    }

    public hasRedirect(): boolean {
        return typeof this.router?.currentRoute?.query.redirect === 'string';
    }
}
