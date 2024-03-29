/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AuthCredentials} from '@klipper/bow/auth/AuthCredentials';
import {AuthManager} from '@klipper/bow/auth/AuthManager';
import {AuthToken} from '@klipper/bow/auth/AuthToken';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class NullAuthManager implements AuthManager {
    private readonly tokenValue: string;

    public constructor(tokenValue: string = 'null') {
        this.tokenValue = tokenValue;
    }

    public async login(credentials: AuthCredentials): Promise<AuthToken> {
        return Promise.resolve({
            type: 'null',
            createdAt: (new Date()).toISOString(),
            expiresIn: null,
            accessToken: this.tokenValue,
            refreshToken: null,
        } as AuthToken);
    }

    public async refresh(refreshToken: string, scope?: string): Promise<AuthToken> {
        return Promise.resolve({
            type: 'null',
            createdAt: (new Date()).toISOString(),
            expiresIn: null,
            accessToken: this.tokenValue,
            refreshToken: null,
        } as AuthToken);
    }

    public async logout(token: string|null): Promise<void> {
    }

    public async cancel(): Promise<void> {
    }
}
