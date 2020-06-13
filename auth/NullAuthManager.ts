/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AuthCredentials} from './AuthCredentials';
import {AuthResponse} from './AuthResponse';
import {AuthManager} from './AuthManager';
import {AuthState} from '../stores/auth/AuthState';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class NullAuthManager implements AuthManager {
    private readonly tokenValue: string;

    public constructor(tokenValue: string = 'null') {
        this.tokenValue = tokenValue;
    }

    public async login(credentials: AuthCredentials): Promise<AuthResponse> {
        return Promise.resolve({
            token: this.tokenValue,
        } as AuthResponse);
    }

    public async logout(state: AuthState): Promise<void> {
        return Promise.resolve();
    }

    public async cancel(): Promise<void> {
    }
}
