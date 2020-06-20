/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {RouteConfig, RedirectOption} from 'vue-router';

/**
 * Create the routes for router with required routes.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function createRoutes(routes: RouteConfig[],
                             redirectRoot?: RedirectOption,
                             standardLogin: boolean = true): RouteConfig[] {
    if (undefined !== redirectRoot) {
        routes.push({
            path: '',
            name: 'root',
            redirect: redirectRoot,
        });
    }

    if (standardLogin) {
        routes.push({
            path: '/login',
            name: 'login',
            components: {
                default: () => import(/* webpackChunkName: "views-login" */ '../views/Login.vue'),
            },
        });
    }

    routes.push({
        path: '*',
        name: 'not-found',
        components: {
            default: () => import(/* webpackChunkName: "views-not-found" */ '../views/NotFound.vue'),
        },
    });

    return routes;
}

/**
 * Create the base of router.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function createRouterBase(publicPath: string, serverBaseUrl: string): string|undefined {
    publicPath = publicPath.replace(/[\\/]+$/g, '');
    let val: string|undefined;

    if (document.location.pathname.startsWith(publicPath)) {
        try {
            const serverUrl = new URL(serverBaseUrl);

            if (serverUrl.host !== document.location.host) {
                val = publicPath;
            }
        } catch (e) {}
    }

    return val;
}
