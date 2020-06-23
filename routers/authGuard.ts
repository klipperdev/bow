/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue from 'vue';
import {Store} from 'vuex';
import Router, {RawLocation, Route} from 'vue-router';
import {AuthModuleState} from '../stores/auth/AuthModuleState';
import {I18nModuleState} from '../stores/i18n/I18nModuleState';
import {AccountModuleState} from '../stores/account/AccountModuleState';

/**
 * Add the auth router guard.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function addAuthGuard(router: Router, store: Store<AuthModuleState & I18nModuleState>): void {
    router.beforeEach(async (to: Route, from: Route,
                             next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) => {
        let guard;

        if (undefined !== window && undefined !== document) {
            const main = document.querySelector('.v-main') as HTMLElement;

            if (null !== main) {
                const mainStyle = window.getComputedStyle(main);
                main.style.transitionDelay = 'login' === to.name || 'login' === from.name
                    ? mainStyle.transitionDuration
                    : '';

                if (main.style.transitionDelay) {
                    window.setTimeout(() => {
                        main.style.transitionDelay = '';
                    }, 400);
                }
            }
        }

        if (to.matched.some((record) => record.meta.requiresAuth)) {
            if (!store.state.auth.authenticated) {
                guard = {
                    name: 'login',
                    params: {
                        locale: store.state.i18n.locale,
                    },
                    query: {
                        redirect: to.fullPath,
                    },
                };
            }
        }

        next(guard);
    });
}

/**
 * Add the organization router guard.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function addOrganizationGuard(router: Router, store: Store<AccountModuleState>): void {
    router.beforeEach(async (to: Route, from: Route,
                             next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) => {
        if (to.params.organization) {
            store.dispatch('account/setOrganization', to.params.organization);
        }

        next();
    });
}
