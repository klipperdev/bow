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
import {Canceler} from '@klipper/http-client/Canceler';
import {CancelerBag} from '@klipper/http-client/CancelerBag';
import {KlipperClient} from '@klipper/sdk/KlipperClient';
import {Authorization} from '@klipper/sdk/services/Authorization';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class KlipperAuthManager implements AuthManager {
    private readonly client: KlipperClient;

    private previousRequests: CancelerBag = new CancelerBag();

    public constructor(client: KlipperClient) {
        this.client = client;
    }

    public async login(credentials: AuthCredentials): Promise<AuthToken> {
        this.previousRequests.cancelAll();
        const canceler = this.previousRequests.add(new Canceler());

        const createdAt = new Date();
        const res = await this.client.get<Authorization>(Authorization).login({
            username: credentials.username,
            password: credentials.password,
        }, canceler);

        this.previousRequests.remove(canceler);

        return Promise.resolve({
            type: res.token_type,
            createdAt: createdAt.toISOString(),
            expiresIn: res.expires_in,
            accessToken: res.access_token,
            refreshToken: res.refresh_token,
        } as AuthToken);
    }

    public async refresh(refreshToken: string, scope?: string): Promise<AuthToken> {
        this.previousRequests.cancelAll();
        const canceler = this.previousRequests.add(new Canceler());

        const createdAt = new Date();
        const res = await this.client.get<Authorization>(Authorization).refresh(
            refreshToken,
            scope,
            canceler,
        );

        this.previousRequests.remove(canceler);

        return Promise.resolve({
            type: res.token_type,
            createdAt: createdAt.toISOString(),
            expiresIn: res.expires_in,
            accessToken: res.access_token,
            refreshToken: res.refresh_token,
        } as AuthToken);
    }

    public async logout(token: string|null): Promise<void> {
        this.previousRequests.cancelAll();
        const canceler = new Canceler();

        await this.client.get<Authorization>(Authorization).logout(canceler);
    }

    public async cancel(): Promise<void> {
        this.previousRequests.cancelAll();
    }
}
