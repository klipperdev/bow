/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import _Vue, {PluginObject} from 'vue';
import {Store} from 'vuex';
import {AccountModuleState} from '../stores/account/AccountModuleState';
import {User} from '../stores/account/User';

/**
 * Account vue plugin.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default class VueAccount<S extends AccountModuleState = AccountModuleState> implements PluginObject<Store<S>> {
    private readonly store: Store<S>;

    constructor(store: Store<S>) {
        this.store = store;
    }

    public install(Vue: typeof _Vue): void {
        const self = this;

        Object.defineProperty(Vue.prototype, '$user', {
            get(this: Vue): User|undefined {
                return self.store.state.account.user;
            },
        });

        Object.defineProperty(Vue.prototype, '$org', {
            get(this: Vue): string {
                return self.store.state.account.organization;
            },
        });

        Object.defineProperty(Vue.prototype, '$orgLabel', {
            get(this: Vue): string {
                return self.store.state.account.organizationInfo
                    ? self.store.state.account.organizationInfo.label
                    : self.store.state.account.organization;
            },
        });

        Vue.prototype.isOrg = (): boolean => {
            return self.store.getters['account/isOrganization'] as boolean;
        };
    }
}
