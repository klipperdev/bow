/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AccountState} from '@klipper/bow/stores/account/AccountState';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface AccountModuleState {
    account: AccountState;
}
