/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AxiosRequestConfig} from 'axios';
import {Store} from 'vuex';
import {KlipperClient} from '@klipper/sdk/KlipperClient';
import {I18nModuleState} from '../stores/i18n/I18nModuleState';
import {AuthModuleState} from '../stores/auth/AuthModuleState';

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