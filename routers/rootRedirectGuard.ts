/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {replaceOrgInParams} from '@klipper/bow/routers/organizationGuard';
import {AccountModuleState} from '@klipper/bow/stores/account/AccountModuleState';
import Vue from 'vue';
import Router, {RawLocation, Location, Route} from 'vue-router';
import {Store} from 'vuex';

/**
 * Add the root redirection guard.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function addRootRedirectGuard<S extends AccountModuleState = AccountModuleState>(router: Router, store: Store<S>, baseUrl: string, userContextRedirectRoute?: Location, userContextRedirectOrgRoute?: Location): void {
    router.beforeEach(async (
        to: Route,
        from: Route,
        next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void,
    ) => {
        baseUrl = baseUrl.replace(/^\/|\/$/g, '');
        let guard;
        const orgReplacement = ['.', '-', '_', '_organization', '_org', '-organization', '-org', baseUrl];
        const routeOrg = to.params?.organization || to.params?.org || null;
        const org = !!routeOrg && !orgReplacement.includes(routeOrg) ? routeOrg : store.state.account.organization;

        if (['/', '/' + baseUrl].includes(to.path)) {
            if (undefined !== userContextRedirectRoute && 'user' === org) {
                guard = userContextRedirectRoute;
            } else if (undefined !== userContextRedirectOrgRoute) {
                guard = userContextRedirectOrgRoute;
            } else if (undefined !== userContextRedirectRoute) {
                guard = userContextRedirectRoute;
            }
        } else if (['/' + org, '/' + baseUrl + '/' + org].includes(to.path)) {
            if (undefined !== userContextRedirectOrgRoute && 'user' !== org) {
                guard = userContextRedirectOrgRoute;
            } else if (undefined !== userContextRedirectRoute) {
                guard = userContextRedirectRoute;
            } else if (undefined !== userContextRedirectOrgRoute) {
                guard = userContextRedirectOrgRoute;
            }
        }

        if (guard) {
            replaceOrgInParams(org, guard);
        }

        next(guard);
    });
}
