/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AuthModuleState} from '@klipper/bow/stores/auth/AuthModuleState';
import {Canceler} from '@klipper/http-client/Canceler';
import {KlipperClient} from '@klipper/sdk/KlipperClient';
import {CancelerCancelToken} from '@klipper/sdk/requests/CancelerCancelToken';
import {CommonRequestConfig} from '@klipper/sdk/requests/CommonRequestConfig';
import {AxiosRequestConfig} from 'axios';
import {Store} from 'vuex';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default class ApiAuthQueue {
    private static prepareRequest(config: AxiosRequestConfig): Canceler|undefined {
        config.headers.Authorization = undefined;
        let canceler: Canceler|undefined;

        if (config.cancelToken && (config.cancelToken as CancelerCancelToken).originalCanceler) {
            canceler = (config.cancelToken as CancelerCancelToken).originalCanceler as Canceler;
        }

        config.cancelToken = undefined;

        return canceler;
    }

    private readonly apiClient: KlipperClient;

    private readonly store: Store<AuthModuleState>;

    private queueSubscribers: Array<() => void> = [];

    public constructor(apiClient: KlipperClient, store: Store<AuthModuleState>) {
        this.apiClient = apiClient;
        this.store = store;
    }

    public async onError(error: any): Promise<any> {
        const originalConfig = Object.assign({}, error.config) as CommonRequestConfig;

        if (error.response && 401 === error.response.status) {
            let rData = error.response.data;

            if (rData instanceof ArrayBuffer && 'application/json' === error.response.headers['content-type']) {
                // @ts-ignore
                rData = JSON.parse(Buffer.from(rData).toString('utf8'));
            }

            if ('access_denied' === rData.error) {
                if (undefined === originalConfig.auth && !originalConfig.skipRetry) {
                    return new Promise((resolve) => {
                        this.addQueueSubscriber((): void => {
                            const canceler = ApiAuthQueue.prepareRequest(originalConfig);
                            resolve(this.apiClient.requestRaw(originalConfig, canceler));
                        });

                        if (!this.store.state.auth.refreshPending) {
                            this.store.dispatch('auth/refresh')
                                .then(() => {
                                    if (this.hasAccessToken()) {
                                        this.onAccessTokenFetched();
                                    } else {
                                        this.onAccessTokenError();
                                    }
                                })
                                .catch(() => {
                                    this.onAccessTokenError();
                                });
                        }
                    });
                }
            }
        }

        return Promise.reject(error);
    }

    private hasAccessToken(): boolean {
        return this.store.state.auth.authenticated && !!this.store.state.auth.tokenType && !!this.store.state.auth.accessToken;
    }

    private onAccessTokenFetched(): void {
        this.queueSubscribers = this.queueSubscribers.filter((callback: () => void) => callback());
    }

    private onAccessTokenError(): void {
        this.queueSubscribers = [];
    }

    private addQueueSubscriber(callback: () => void): void {
        this.queueSubscribers.push(callback);
    }
}
