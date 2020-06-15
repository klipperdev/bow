/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Canceler} from '@klipper/http-client/Canceler';
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

    private previousRequest?: Canceler;

    public constructor(client: KlipperClient) {
        this.client = client;
    }

    public async login(credentials: AuthCredentials): Promise<AuthToken> {
        await this.cancel();
        this.previousRequest = new Canceler();

        const createdAt = new Date();
        const res = await this.client.get<Authorization>(Authorization).login({
            username: credentials.username,
            password: credentials.password,
        }, this.previousRequest);

        return Promise.resolve({
            type: res.token_type,
            createdAt,
            expiresIn: res.expires_in,
            accessToken: res.access_token,
            refreshToken: res.refresh_token,
        } as AuthToken);
    }

    public async logout(token: string|null): Promise<void> {
        await this.client.get<Authorization>(Authorization).logout(this.previousRequest);
    }

    public async cancel(): Promise<void> {
        if (this.previousRequest) {
            this.previousRequest.cancel();
            this.previousRequest = undefined;
        }
    }
}
