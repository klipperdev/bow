/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {cleanRedirect} from '@klipper/bow/utils/url';
import Router, {Location, Route} from 'vue-router';

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

export function mergeRouteQueryValues(query: Dictionary<string|string[]|object|object[]|null|undefined>, route?: Route|Location, prefix?: string, urlSearchParams?: URLSearchParams): void {
    for (const key in query) {
        if (query.hasOwnProperty(key)) {
            const queryKey = prefix ? prefix + '_' + key : key;
            const value = query[key];
            let queryValue;

            if (null === value || undefined === value) {
                if (urlSearchParams) {
                    urlSearchParams.delete(queryKey);
                }

                if (route && undefined !== route.query) {
                    delete route.query[queryKey];
                }
            } else {
                if (typeof value === 'object') {
                    if (Array.isArray(value)) {
                        queryValue = encodeURIComponent(value.toString());
                    } else {
                        queryValue = window.btoa(unescape(encodeURIComponent(
                            typeof value === 'object' ? JSON.stringify(value) : value,
                        )));
                    }
                } else {
                    queryValue = encodeURIComponent(value);
                }

                if (urlSearchParams) {
                    urlSearchParams.set(queryKey, queryValue);
                }

                if (route) {
                    if (undefined === route.query) {
                        route.query = {};
                    }

                    route.query[queryKey] = queryValue;
                }
            }
        }
    }
}

export function replaceRouteQuery(query: Dictionary<string|string[]|object|object[]|null|undefined>, route?: Route, prefix?: string): void {
    if (undefined !== history && undefined !== URLSearchParams) {
        const queryParams = new URLSearchParams(window.location.search);

        mergeRouteQueryValues(query, route, prefix, queryParams);

        const url = '?' + queryParams.toString();

        history.replaceState(null, '', '?' === url ? window.location.pathname : url);
    }
}

export function restoreRouteQuery<T = any>(query: string, route: Route, prefix?: string, defaultValue?: T, type?: string): T|undefined {
    const queryKey = prefix ? prefix + '_' + query : query;
    let value: any|undefined;

    if (route.query.hasOwnProperty(queryKey)) {
        value = route.query[queryKey];
    }

    if (type && undefined !== value) {
        switch (type) {
            case 'number':
                value = parseInt(decodeURIComponent(value), 10);
                break;
            case 'array':
                value = decodeURIComponent(value);
                value = value.split(',');

                break;
            case 'object':
                try {
                    value = JSON.parse(decodeURIComponent(escape(window.atob(value))));
                } catch (e) {
                    value = undefined;
                }

                break;
            default:
                try {
                    value = JSON.parse(decodeURIComponent(escape(window.atob(value))));
                } catch (e) {
                    try {
                        value = JSON.parse(decodeURIComponent(escape(value)));
                    } catch (e) {}
                }

                break;
        }
    } else if (undefined !== value) {
        value = decodeURIComponent(value);
    }

    return value || defaultValue;
}

export async function redirectIfExist(router: Router): Promise<boolean> {
    if (router.currentRoute.query && router.currentRoute.query.redirect) {
        const redirect = Array.isArray(router.currentRoute.query.redirect)
            ? router.currentRoute.query.redirect[0]
            : router.currentRoute.query.redirect;

        if (redirect) {
            await router.replace(decodeURIComponent(cleanRedirect(redirect)));

            return true;
        }
    }

    return false;
}
