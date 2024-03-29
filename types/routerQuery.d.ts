/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {RouterQuery} from '@klipper/bow/routerQuery/RouterQuery';
import {RouterQueryKeys} from '@klipper/bow/routerQuery/RouterQueryKeys';
import {Location} from 'vue-router';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
declare module 'vue/types/vue' {
    interface Vue {
        $routerQuery: RouterQuery;

        $routeAddQueries(route: Location, query: RouterQueryKeys, prefix?: string, redirect: boolean = false): Location;

        $routeAddRedirect(route: Location, keepUrlRedirect: boolean = false): Location;

        $routeGetRedirect(fallbackRoute: Location): Location;

        $routeHasRedirect(): boolean;
    }
}
