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
                        redirect: to.fullPath,
                    },
                };
            }
        }

        next(guard);
    });
}
