/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Route, Location} from 'vue-router';
import {Dictionary} from '@klipper/bow/generic/Dictionary';

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

export function restoreRouteQuery<T>(query: string, route: Route, prefix?: string, defaultValue?: T, type?: string): T|undefined {
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
                break;
        }
    }

    return value || defaultValue;
}

