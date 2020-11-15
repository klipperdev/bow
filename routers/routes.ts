/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {RedirectOption, RouteConfig} from 'vue-router';

/**
 * Create the routes for router with required routes.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function createRoutes(routes: RouteConfig[],
                             settingRoutes: RouteConfig[],
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
                path: '/:org([\\w-]+)/organizations/:id',
                name: 'user-organization',
                meta: {
                    requiresAuth: true,
                    appBar: {
                        title: (vm: any) => {
                            return vm.$ml('organization');
                        },
                    },
                    context: ['user'],
                },
                components: {
                    default: () => import(/* webpackChunkName: "views-organizations" */ '@klipper/bow/views/organizations/OrganizationView/OrganizationView.vue'),
                },
            });

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
                default: () => import(/* webpackChunkName: "views-login" */ '@klipper/bow/views/Login/Login.vue'),
            },
        });
    }

    if (userSettingsRoute) {
        const settingRoute = {
            path: '/:org([\\w-]+)/settings',
            meta: {
                settings: true,
                appBar: {title: 'views.settings.title', translatable: true},
            },
            components: {
                default: () => import(/* webpackChunkName: "views-settings" */ '@klipper/bow/views/settings/Settings/Settings.vue'),
                toolbar: () => import(/* webpackChunkName: "views-settings" */ '@klipper/bow/views/settings/SettingsToolbar/SettingsToolbar.vue'),
                toolbarExtension: () => import(/* webpackChunkName: "views-settings" */ '@klipper/bow/views/settings/SettingsToolbarExtension/SettingsToolbarExtension.vue'),
            },
            children: [
                {
                    path: '',
                    name: 'settings',
                    redirect: {name: 'settings-account'},
                },
                {
                    path: 'global',
                    name: 'settings-global',
                    redirect: {name: 'settings-account'},
                },
                {
                    path: 'global/account',
                    name: 'settings-account',
                    meta: {
                        toolbarExtensionKey: 'settings',
                        title: 'views.account-settings.account',
                        translatable: true,
                        context: ['organization', 'user'],
                    },
                    components: {
                        default: () => import(/* webpackChunkName: "views-settings" */ '@klipper/bow/views/AccountSettings/AccountSettings.vue'),
                    },
                },
                {
                    path: 'global/users',
                    name: 'settings-org-users',
                    meta: {
                        requiresAuth: true,
                        toolbarExtensionKey: 'settings',
                        title: (vm: any) => {
                            return vm.$mpl('user');
                        },
                        translatable: false,
                        context: ['organization'],
                    },
                    components: {
                        default: () => import(/* webpackChunkName: "views-settings" */ '@klipper/bow/views/settings/organizations/OrganizationUserList/OrganizationUserList.vue'),
                        toolbar: () => import(/* webpackChunkName: "views-settings" */ '@klipper/bow/components/KDataListSearchField/KDataListSearchField.vue'),
                    },
                },
                {
                    path: 'global/users/:id',
                    name: 'settings-org-user',
                    meta: {
                        requiresAuth: true,
                        toolbarExtensionKey: 'settings',
                        translatable: false,
                        context: ['organization'],
                    },
                    component: () => import(/* webpackChunkName: "views-settings" */ '@klipper/bow/views/settings/organizations/OrganizationUserView/OrganizationUserView.vue'),
                },
                {
                    path: 'global/roles',
                    name: 'settings-org-roles',
                    meta: {
                        requiresAuth: true,
                        toolbarExtensionKey: 'settings',
                        title: (vm: any) => {
                            return vm.$mpl('role');
                        },
                        translatable: false,
                        context: ['organization'],
                    },
                    components: {
                        default: () => import(/* webpackChunkName: "views-settings" */ '@klipper/bow/views/settings/organizations/OrganizationRoleList/OrganizationRoleList.vue'),
                        toolbar: () => import(/* webpackChunkName: "views-settings" */ '@klipper/bow/components/KDataListSearchField/KDataListSearchField.vue'),
                    },
                },
                {
                    path: 'global/roles/:id',
                    name: 'settings-org-role',
                    meta: {
                        requiresAuth: true,
                        toolbarExtensionKey: 'settings',
                        translatable: false,
                        context: ['organization'],
                    },
                    component: () => import(/* webpackChunkName: "views-settings" */ '@klipper/bow/views/settings/organizations/OrganizationRoleView/OrganizationRoleView.vue'),
                },
                {
                    path: 'global/groups',
                    name: 'settings-org-groups',
                    meta: {
                        requiresAuth: true,
                        toolbarExtensionKey: 'settings',
                        title: (vm: any) => {
                            return vm.$mpl('group');
                        },
                        translatable: false,
                        context: ['organization'],
                    },
                    components: {
                        default: () => import(/* webpackChunkName: "views-settings" */ '@klipper/bow/views/settings/organizations/OrganizationGroupList/OrganizationGroupList.vue'),
                        toolbar: () => import(/* webpackChunkName: "views-settings" */ '@klipper/bow/components/KDataListSearchField/KDataListSearchField.vue'),
                    },
                },
                {
                    path: 'global/groups/:id',
                    name: 'settings-org-group',
                    meta: {
                        requiresAuth: true,
                        toolbarExtensionKey: 'settings',
                        translatable: false,
                        context: ['organization'],
                    },
                    component: () => import(/* webpackChunkName: "views-settings" */ '@klipper/bow/views/settings/organizations/OrganizationGroupView/OrganizationGroupView.vue'),
                },
                {
                    path: 'choices',
                    name: 'settings-choices',
                    meta: {
                        requiresAuth: true,
                        translatable: false,
                        toolbarTitle: (vue: Vue) => vue.$mpl('choice'),
                    },
                    components: {
                        default: () => import(/* webpackChunkName: "views-settings" */ '@klipper/bow/views/settings/choice/ChoiceList/ChoiceList.vue'),
                        toolbar: () => import(/* webpackChunkName: "views-settings" */ '@klipper/bow/components/KDataListSearchField/KDataListSearchField.vue'),
                    },
                },
                {
                    path: 'choices/:id',
                    name: 'settings-choice',
                    meta: {
                        requiresAuth: true,
                        toolbarTitle: (vue: Vue) => vue.$ml('choice'),
                    },
                    component: () => import(/* webpackChunkName: "views-settings" */ '@klipper/bow/views/settings/choice/ChoiceView/ChoiceView.vue'),
                },
            ],
        };

        if (settingRoutes.length > 0) {
            for (const customSettingRoute of settingRoutes) {
                settingRoute.children.push(customSettingRoute as any);
            }
        }

        routes.push(settingRoute);
    }

    if (organizationRoute) {
        routes.push({
            path: '/:org([\\w-]+)/:path(.*)?',
            name: 'org-not-found',
            meta: {requiresInitialization: false},
            components: {
                default: () => import(/* webpackChunkName: "views-not-found" */ '@klipper/bow/views/NotFound/NotFound.vue'),
            },
        });
    }

    routes.push({
        path: '*',
        name: 'not-found',
        meta: {requiresInitialization: false},
        components: {
            default: () => import(/* webpackChunkName: "views-not-found" */ '@klipper/bow/views/NotFound/NotFound.vue'),
        },
    });

    return routes;
}
