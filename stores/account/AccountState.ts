/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {User} from './User';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface AccountState {
    initialized: boolean;
    initializationPending: boolean;
    user?: User;
    organization: string;
}
