/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Organization} from '@klipper/bow/stores/account/Organization';
import {User} from '@klipper/bow/stores/account/User';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface AccountState {
    initialized: boolean;
    initializationPending: boolean;
    user?: User;
    userUnauthorized: boolean;
    organization: string;
    organizationPending: boolean;
    organizationError: boolean;
    organizationSwitcherOpen: boolean;
    organizationInfo?: Organization;
}
