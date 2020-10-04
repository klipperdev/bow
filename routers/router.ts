/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Route, RouteConfig, RedirectOption} from 'vue-router';
import {Dictionary} from '@klipper/bow/generic/Dictionary';

/**
 * Create the routes for router with required routes.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function createRoutes(routes: RouteConfig[],
                             redirectRoot?: RedirectOption,
                             standardLogin: boolean = true,
                             organizationRoute: boolean = true,
                             userSettingsRoute: boolean = true,
): RouteConfig[] {
    if (undefined !== redirectRoot) {
        routes.push({
            path: '',
            name: 'root',
            redirect: redirectRoot,
        });

        if (organizationRoute) {
            routes.push({
                path: '/:org([\\w-]+)',
                name: 'org-root',
                redirect: redirectRoot,
            });
        }
    }
    if (standardLogin) {
        routes.push({
            path: '/login',
            name: 'login',
            meta: {requiresInitialization: false},
            components: {
                default: () => import(/* webpackChunkName: "views-login" */ '@klipper/bow/views/Login.vue'),
            },
        });
    }

    if (userSettingsRoute) {
        routes.push({
            path: '/:org([\\w-]+)/settings',
            meta: {
                settings: true,
                appBar: {title: 'views.settings.title', translatable: true},
            },
            components: {
                default: () => import(/* webpackChunkName: "views-settings" */ '@klipper/bow/views/Settings.vue'),
                toolbar: () => import(/* webpackChunkName: "views-settings" */ '@klipper/bow/views/settings/SettingsToolbar.vue'),
                toolbarExtension: () => import(/* webpackChunkName: "views-settings" */ '@klipper/bow/views/settings/SettingsToolbarExtension.vue'),
            },
            children: [
                {
                    path: '',
                    name: 'settings',
                    redirect: {name: 'settings-account'},
                },
                {
                    path: 'account',
                    name: 'settings-account',
                    meta: {
                        toolbarExtensionKey: 'settings',
                        title: 'views.account-settings.account',
                        translatable: true,
                        context: ['organization', 'user'],
                    },
                    components: {
                        default: () => import(/* webpackChunkName: "views-settings" */ '@klipper/bow/views/AccountSettings.vue'),
                    },
                },
                {
                    path: 'users',
                    name: 'settings-org-users',
                    meta: {
                        requiresAuth: true,
                        toolbarExtensionKey: 'settings',
                        title: (vm: Vue) => {
                            return vm.$mpl('user');
                        },
                        translatable: false,
                        context: ['organization'],
                    },
                    components: {
                        default: () => import(/* webpackChunkName: "views-settings" */ '@klipper/bow/views/settings/organizations/OrganizationUserList.vue'),
                        toolbar: () => import(/* webpackChunkName: "views-settings" */ '@klipper/bow/components/KDataListSearchField/KDataListSearchField.vue'),
                    },
                },
                {
                    path: 'users/:id',
                    name: 'settings-org-user',
                    meta: {
                        requiresAuth: true,
                        toolbarExtensionKey: 'settings',
                        translatable: false,
                        context: ['organization'],
                    },
                    component: () => import(/* webpackChunkName: "views-settings" */ '@klipper/bow/views/settings/organizations/OrganizationUserView.vue'),
                },
                {
                    path: 'roles',
                    name: 'settings-org-roles',
                    meta: {
                        requiresAuth: true,
                        toolbarExtensionKey: 'settings',
                        title: (vm: Vue) => {
                            return vm.$mpl('role');
                        },
                        translatable: false,
                        context: ['organization'],
                    },
                    components: {
                        default: () => import(/* webpackChunkName: "views-settings" */ '@klipper/bow/views/settings/organizations/OrganizationRoleList.vue'),
                        toolbar: () => import(/* webpackChunkName: "views-settings" */ '@klipper/bow/components/KDataListSearchField/KDataListSearchField.vue'),
                    },
                },
                {
                    path: 'roles/create',
                    name: 'settings-org-role-create',
                    meta: {
                        requiresAuth: true,
                        toolbarExtensionKey: 'settings',
                        translatable: false,
                        context: ['organization'],
                    },
                    component: () => import(/* webpackChunkName: "views-settings" */ '@klipper/bow/views/settings/organizations/OrganizationRoleView.vue'),
                },
                {
                    path: 'roles/:id',
                    name: 'settings-org-role',
                    meta: {
                        requiresAuth: true,
                        toolbarExtensionKey: 'settings',
                        translatable: false,
                        context: ['organization'],
                    },
                    component: () => import(/* webpackChunkName: "views-settings" */ '@klipper/bow/views/settings/organizations/OrganizationRoleView.vue'),
                },
                {
                    path: 'groups',
                    name: 'settings-org-groups',
                    meta: {
                        requiresAuth: true,
                        toolbarExtensionKey: 'settings',
                        title: (vm: Vue) => {
                            return vm.$mpl('group');
                        },
                        translatable: false,
                        context: ['organization'],
                    },
                    components: {
                        default: () => import(/* webpackChunkName: "views-settings" */ '@klipper/bow/views/settings/organizations/OrganizationGroupList.vue'),
                        toolbar: () => import(/* webpackChunkName: "views-settings" */ '@klipper/bow/components/KDataListSearchField/KDataListSearchField.vue'),
                    },
                },
                {
                    path: 'groups/:id',
                    name: 'settings-org-group',
                    meta: {
                        requiresAuth: true,
                        toolbarExtensionKey: 'settings',
                        translatable: false,
                        context: ['organization'],
                    },
                    component: () => import(/* webpackChunkName: "views-settings" */ '@klipper/bow/views/settings/organizations/OrganizationGroupView.vue'),
                },
            ],
        });
    }

    if (organizationRoute) {
        routes.push({
            path: '/:org([\\w-]+)/:path(.*)?',
            name: 'org-not-found',
            meta: {requiresInitialization: false},
            components: {
                default: () => import(/* webpackChunkName: "views-not-found" */ '@klipper/bow/views/NotFound.vue'),
            },
        });
    }

    routes.push({
        path: '*',
        name: 'not-found',
        meta: {requiresInitialization: false},
        components: {
            default: () => import(/* webpackChunkName: "views-not-found" */ '@klipper/bow/views/NotFound.vue'),
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

export function replaceRouteQuery(query: Dictionary<string|string[]|object|object[]|null|undefined>, route?: Route, prefix?: string): void {
    if (undefined !== history && undefined !== URLSearchParams) {
        const queryParams = new URLSearchParams(window.location.search);

        for (const key in query) {
            if (query.hasOwnProperty(key)) {
                const queryKey = prefix ? prefix + '_' + key : key;
                const value = query[key];
                let queryValue;

                if (null === value || undefined === value) {
                    queryParams.delete(queryKey);

                    if (route) {
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

                    queryParams.set(queryKey, queryValue);

                    if (route) {
                        route.query[queryKey] = queryValue;
                    }
                }
            }
        }

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
