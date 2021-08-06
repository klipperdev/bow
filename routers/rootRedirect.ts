/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AccountModuleState} from '@klipper/bow/stores/account/AccountModuleState';
import Vue from 'vue';
import Router, {RawLocation, Location, Route} from 'vue-router';
import {Store} from 'vuex';

/**
 * Add the root redirection guard.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function addRootRedirectGuard<S extends AccountModuleState = AccountModuleState>(router: Router, store: Store<S>, userContextRedirectRoute?: Location, userContextRedirectOrgRoute?: Location): void {
    router.beforeEach(async (to: Route, from: Route,
                             next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) => {
        let guard;

        if ('/' === to.path) {
            if (undefined !== userContextRedirectRoute) {
                guard = userContextRedirectRoute;
            } else if (undefined !== userContextRedirectOrgRoute) {
                guard = userContextRedirectOrgRoute;
            }
        } else if ('/' + store.state.account.organization === to.path) {
            if (undefined !== userContextRedirectOrgRoute) {
                guard = userContextRedirectOrgRoute;
            } else if (undefined !== userContextRedirectRoute) {
                guard = userContextRedirectRoute;
            }
        }

        next(guard);
    });
}
