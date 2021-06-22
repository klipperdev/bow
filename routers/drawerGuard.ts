/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AccountModuleState} from '@klipper/bow/stores/account/AccountModuleState';
import {DrawerModuleState} from '@klipper/bow/stores/drawer/DrawerModuleState';
import Vue from 'vue';
import Router, {RawLocation, Route} from 'vue-router';
import {Store} from 'vuex';

/**
 * Add the drawer router guard.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function addDrawerContextGuard(router: Router, drawerContext: string, store: Store<DrawerModuleState&AccountModuleState>): void {
    router.beforeEach(async (to: Route,
                             from: Route,
                             next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) => {
        const context = 'user' === store.state.account.organization ? 'user' : 'organization';
        const contextSuffix = isContext(to, drawerContext) ? drawerContext.charAt(0).toUpperCase() + drawerContext.slice(1) : '';

        store.commit('drawer/setContext', context + contextSuffix);
        next();
    });
}

function isContext(route: Route, drawerContext: string): boolean {
    if (route.matched.length > 0) {
        for (let i = route.matched.length - 1; i >= 0; --i) {
            if (route.matched[i].meta[drawerContext]) {
                return true;
            }
        }
    }

    return !!route.meta && !!route.meta[drawerContext];
}
