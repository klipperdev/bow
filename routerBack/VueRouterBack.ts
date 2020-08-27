/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import _Vue, {PluginObject} from 'vue';
import Router from 'vue-router';
import {RouterBack} from '@klipper/bow/routerBack/RouterBack';
import {RouterBackOptions} from '@klipper/bow/routerBack/RouterBackOptions';

/**
 * Router back vue plugin.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default class VueRouterBack implements PluginObject<RouterBackOptions> {
    private readonly router: Router;

    constructor(router: Router) {
        this.router = router;
    }

    public install(Vue: typeof _Vue, options?: RouterBackOptions): void {
        Vue.prototype.$routerBack = new RouterBack(this.router);
        Vue.prototype.$routerBack.setForceHistory(options && options.forceHistory);

        if (options && options.rootRoute) {
            Vue.prototype.$routerBack.setRootRoute(options.rootRoute);
        }
    }
}
