/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import axios, {AxiosError, AxiosRequestConfig} from 'axios';
import {Store} from 'vuex';
import {KlipperClient} from '@klipper/sdk/KlipperClient';
import {I18nModuleState} from '@klipper/bow/stores/i18n/I18nModuleState';
import {AuthModuleState} from '@klipper/bow/stores/auth/AuthModuleState';
import {AccountModuleState} from '@klipper/bow/stores/account/AccountModuleState';

/**
 * Add the locale interceptor.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function addLocaleInterceptor(apiClient: KlipperClient, store: Store<I18nModuleState>): void {
    apiClient.addRequestInterceptor((config: AxiosRequestConfig): AxiosRequestConfig => {
        config.headers['Accept-Language'] = store.state.i18n.locale;

        return config;
    });
}

/**
 * Add the auth interceptor.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function addAuthInterceptor(apiClient: KlipperClient, store: Store<AuthModuleState>): void {
    apiClient.addRequestInterceptor((config: AxiosRequestConfig): AxiosRequestConfig => {
        if (undefined === config.auth && !config.headers.Authorization && store.state.auth.accessToken) {
            config.headers.Authorization = `${store.state.auth.tokenType} ${store.state.auth.accessToken}`;
        }

        return config;
    });
}

/**
 * Add the auth redirection interceptor.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function addAuthRedirectInterceptor(apiClient: KlipperClient, store: Store<AuthModuleState>): void {
    apiClient.addResponseInterceptor(undefined, async (error: AxiosError) => {
        if (error.response && 401 === error.response.status) {
            let rData = error.response.data;

            if (rData instanceof ArrayBuffer && 'application/json' === error.response.headers['content-type']) {
                // @ts-ignore
                rData = JSON.parse(Buffer.from(rData).toString('utf8'));
            }

            if (!store.state.auth.refreshPending && 'access_denied' === rData.error) {
                await store.dispatch('auth/refresh');

                if (store.state.auth.authenticated && store.state.auth.accessToken) {
                    const newConfig = Object.assign({}, error.config);
                    newConfig.headers.Authorization = `${store.state.auth.tokenType} ${store.state.auth.accessToken}`;

                    return axios.request(newConfig);
                }
            }
        }

        return Promise.reject(error);
    });
}

/**
 * Add the organization interceptor.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function addOrganizationInterceptor(apiClient: KlipperClient, store: Store<AccountModuleState>): void {
    apiClient.addRequestInterceptor((config: AxiosRequestConfig): AxiosRequestConfig => {
        if (config.url) {
            config.url = config.url.replace('{organization}', store.state.account.organization);
        }

        return config;
    });
}
