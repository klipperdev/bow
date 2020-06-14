/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {KlipperClient} from '@klipper/sdk/KlipperClient';
import {Authorization} from '@klipper/sdk/services/Authorization';
import {AuthCredentials} from './AuthCredentials';
import {AuthToken} from './AuthToken';
import {AuthManager} from './AuthManager';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class KlipperAuthManager implements AuthManager {
    private readonly client: KlipperClient;

    public constructor(client: KlipperClient) {
        this.client = client;
    }

    public async login(credentials: AuthCredentials): Promise<AuthToken> {
        const createdAt = new Date();
        const res = await this.client.get<Authorization>(Authorization).login({
            username: credentials.username,
            password: credentials.password,
        });

        return Promise.resolve({
            type: res.token_type,
            createdAt,
            expiresIn: res.expires_in,
            accessToken: res.access_token,
            refreshToken: res.refresh_token,
        } as AuthToken);
    }

    public async logout(token: string|null): Promise<void> {
        return Promise.resolve();
    }

    public async cancel(): Promise<void> {
    }
}
