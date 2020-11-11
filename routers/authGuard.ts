/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AuthModuleState} from '@klipper/bow/stores/auth/AuthModuleState';
import {I18nModuleState} from '@klipper/bow/stores/i18n/I18nModuleState';
import {cleanRedirect} from '@klipper/bow/utils/url';
import Vue from 'vue';
import Router, {RawLocation, Route} from 'vue-router';
import {Store} from 'vuex';

/**
 * Add the pre auth router guard.
 *
 * It must be executed first to add the delay transition before the action.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function addPreAuthGuard(router: Router): void {
    router.beforeEach(async (to: Route, from: Route,
                             next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) => {
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

        next();
    });
}


/**
 * Add the auth router guard.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function addAuthGuard(router: Router, store: Store<AuthModuleState & I18nModuleState>): void {
    router.beforeEach(async (to: Route, from: Route,
                             next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) => {
        let guard;

        if (to.matched.some((record) => record.meta.requiresAuth)) {
            if (!store.state.auth.authenticated) {
                guard = {
                    name: 'login',
                    params: {
                        locale: store.state.i18n.locale,
                    },
                    query: {
                        redirect: cleanRedirect(to.fullPath),
                    },
                };
            }
        }

        next(guard);
    });
}
