/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AuthState} from './AuthState';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface AuthModuleState {
    auth: AuthState;
}
