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
import {AccountModuleState} from '../stores/account/AccountModuleState';

/**
 * Add the organization router guard.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function addOrganizationGuard(router: Router, store: Store<AccountModuleState>): void {
    router.beforeEach(async (to: Route, from: Route,
                             next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) => {
        const org = to.params.organization || to.params.org
            ? to.params.organization || to.params.org
            : 'user';

        await store.dispatch('account/setOrganization', org);

        next();
    });
}
