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
export class NullAuthManager<C extends object> implements AuthManager<C> {
    private readonly tokenValue: string;

    public constructor(tokenValue: string = 'null') {
        this.tokenValue = tokenValue;
    }

    public login(credentials: AuthCredentials<C>): Promise<AuthResponse> {
        return Promise.resolve({
            token: this.tokenValue,
        } as AuthResponse);
    }

    public logout(state: AuthState): Promise<void> {
        return Promise.resolve();
    }

    public cancel(): void {
    }
}
