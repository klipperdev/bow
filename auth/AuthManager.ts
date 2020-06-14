/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AuthCredentials} from './AuthCredentials';
import {AuthToken} from './AuthToken';
import {AuthState} from '../stores/auth/AuthState';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface AuthManager {
    login(credentials: AuthCredentials): Promise<AuthToken>;

    logout(token: string|null): Promise<void>;

    cancel(): void;
}
