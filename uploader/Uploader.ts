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
import {AccountModuleState} from '@klipper/bow/stores/account/AccountModuleState';
import {AuthModuleState} from '@klipper/bow/stores/auth/AuthModuleState';
import {I18nModuleState} from '@klipper/bow/stores/i18n/I18nModuleState';
import {DarkModeModuleState} from '@klipper/bow/stores/darkMode/DarkModeModuleState';
import {UploaderOptions} from '@klipper/bow/uploader/UploaderOptions';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {deepMerge} from '@klipper/bow/utils/object';
import {getLocale} from '@klipper/bow/i18n/locale';

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

    public addAuthorizationHeader(headers: Dictionary<string>): Dictionary<string> {
        return Object.assign(headers, {
            Authorization: 'Bearer ' + this.store.state.auth.accessToken,
        });
    }

    public async refreshAuth(silent: boolean = true): Promise<void> {
        await this.store.dispatch('auth/refresh', silent);
    }

    public async refreshAccount(organization: boolean = false): Promise<void> {
        if (organization) {
            await this.store.dispatch('account/refreshOrganizationInfo', true);
        } else {
            await this.store.dispatch('account/refreshUser');
        }
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

        return Uppy<Uppy.StrictTypes>(deepMerge({}, this.options as Dictionary<any>, options));
    }
}
