/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {VoterInterface} from '@klipper/bow/security/voters/VoterInterface';
import {AccountModuleState} from '@klipper/bow/stores/account/AccountModuleState';
import {Store} from 'vuex';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class RoleVoter implements VoterInterface {
    private readonly store: Store<AccountModuleState>;

    public constructor(store: Store<AccountModuleState>) {
        this.store = store;
    }

    supports(attribute: string, subject?: any): boolean {
        return attribute.startsWith('ROLE_');
    }

    voteOnAttribute(attribute: string, subject?: any): boolean {
        return !!this.store.state.account?.user?.securityIdentities?.includes(attribute)
            || !!this.store.state.account?.organizationInfo?.securityIdentities?.includes(attribute);
    }
}
