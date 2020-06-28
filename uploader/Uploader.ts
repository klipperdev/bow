/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Store} from 'vuex';
import Uppy, {UppyOptions} from '@uppy/core';
import {AccountModuleState} from '../stores/account/AccountModuleState';
import {AuthModuleState} from '../stores/auth/AuthModuleState';
import {I18nModuleState} from '../stores/i18n/I18nModuleState';
import {DarkModeModuleState} from '../stores/darkMode/DarkModeModuleState';
import {UploaderOptions} from './UploaderOptions';
import {deepMerge} from '../utils/object';
import {getLocale} from '../i18n/locale';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class Uploader {
    private readonly store: Store<AccountModuleState&AuthModuleState&I18nModuleState&DarkModeModuleState>;
    private readonly options: UploaderOptions;

    public constructor(
        store: Store<AccountModuleState&AuthModuleState&I18nModuleState&DarkModeModuleState>,
        options?: UploaderOptions,
    ) {
        this.store = store;
        this.options = options || {};
    }

    public get isDark(): boolean {
        return this.store.state.darkMode.enabled;
    }

    public get locale(): string {
        return this.store.state.i18n.locale;
    }

    public addAuthorizationHeader(headers: Partial<string>): Partial<string> {
        return Object.assign(headers, {
            Authorization: 'Bearer ' + this.store.state.auth.accessToken,
        });
    }

    public async refreshAuth(silent: boolean = true): Promise<void> {
        await this.store.dispatch('auth/refresh', silent);
    }

    public async refreshAccount(): Promise<void> {
        await this.store.dispatch('account/refreshUser');
    }

    public create(options?: UppyOptions) {
        options = options || {};

        if (undefined === this.options.debug && undefined === options.debug) {
            options.debug = false;
        }

        if (!options.locale) {
            const locales = this.options.locales || {};
            const locale = getLocale(
                Object.keys(locales),
                this.store.state.i18n.locale,
                this.store.state.i18n.fallback,
            );
            options.locale = (this.options.locales || {})[locale];
        }

        return Uppy<Uppy.StrictTypes>(deepMerge({}, this.options as Partial<any>, options));
    }
}