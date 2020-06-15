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

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface AuthManager {
    login(credentials: AuthCredentials): Promise<AuthToken>;

    refresh(refreshToken: string): Promise<AuthToken>;

    logout(token: string|null): Promise<void>;

    cancel(): Promise<void>;
}
