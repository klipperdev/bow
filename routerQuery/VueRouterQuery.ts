/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import _Vue, {PluginObject} from 'vue';
import {Location} from 'vue-router';
import {RouterQuery} from '@klipper/bow/routerQuery/RouterQuery';
import {RouterQueryKeys} from '@klipper/bow/routerQuery/RouterQueryKeys';

/**
 * Router params vue plugin.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default class VueRouterQuery implements PluginObject<void> {
    private readonly routerQuery: RouterQuery;

    constructor() {
        this.routerQuery = new RouterQuery();
    }

    public install(Vue: typeof _Vue): void {
        const self = this;

        Object.defineProperty(Vue.prototype, '$routerQuery', {
            get(this: Vue): RouterQuery {
                return self.routerQuery;
            },
        });

        Vue.prototype.$routeAddQueries = <T = any>(route: Location, query: RouterQueryKeys, prefix?: string): Location => {
            return self.routerQuery.add(route, query, prefix);
        };
    }
}
