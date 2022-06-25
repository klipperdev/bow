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
import _Vue, {PluginObject} from 'vue';
import Router, {Location, RawLocation} from 'vue-router';

/**
 * Router params vue plugin.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default class VueRouterQuery implements PluginObject<void> {
    private readonly router: Router;

    constructor(router: Router) {
        this.router = router;
    }

    public install(Vue: typeof _Vue): void {
        Vue.prototype.$routerQuery = new RouterQuery(this.router);

        Vue.prototype.$routeAddQueries = (route: Location, query?: RouterQueryKeys, prefix?: string, redirect: boolean = false): Location => {
            return Vue.prototype.$routerQuery.add(route, query, prefix, redirect);
        };

        Vue.prototype.$routeAddRedirect = (route: Location): Location => {
            return Vue.prototype.$routerQuery.addRedirect(route);
        };

        Vue.prototype.$routeGetRedirect = (fallbackRoute: RawLocation): RawLocation => {
            return Vue.prototype.$routerQuery.getRedirect(fallbackRoute);
        };
    }
}
