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
import Router, {Location, RawLocation, Route} from 'vue-router';
import {AccountModuleState} from '@klipper/bow/stores/account/AccountModuleState';

/**
 * Add the organization router guard.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function addOrganizationGuard(router: Router, store: Store<AccountModuleState>): void {
    router.beforeEach(async (to: Route, from: Route,
                             next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) => {
        let guard: Location|undefined;

        const hasOrgParam = !!(to.params.organization || to.params.org);
        const org = hasOrgParam ? to.params.organization || to.params.org : 'user';
        const orgReplacement = ['.', '-', '_', '_organization', '_org', '-organization', '-org'];

        if (hasOrgParam && orgReplacement.includes(org)) {
            guard = {
                name: to.name as string,
                hash: to.hash,
                params: Object.assign({}, to.params || {}),
                query: Object.assign({}, to.query || {}),
                replace: true,
            };

            if ((guard.params as any).org) {
                (guard.params as any).org = store.state.account.organization;
            } else {
                (guard.params as any).organization = store.state.account.organization;
            }
        }

        if (!guard) {
            await store.dispatch('account/setOrganization', org);
        }

        next(guard);
    });
}
