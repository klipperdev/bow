/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import ApiAuthQueue from '@klipper/bow/api/ApiAuthQueue';
import {AccountModuleState} from '@klipper/bow/stores/account/AccountModuleState';
import {AuthModuleState} from '@klipper/bow/stores/auth/AuthModuleState';
import {I18nModuleState} from '@klipper/bow/stores/i18n/I18nModuleState';
import {KlipperClient} from '@klipper/sdk/KlipperClient';
import {AxiosRequestConfig} from 'axios';
import {Store} from 'vuex';

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
    const apiAuthQueue = new ApiAuthQueue(apiClient, store);

    apiClient.addResponseInterceptor(undefined, async (error: any): Promise<any> => {
        return await apiAuthQueue.onError(error);
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
