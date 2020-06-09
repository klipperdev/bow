/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Store} from 'vuex';
import {I18nModuleState} from '../stores/i18n/I18nModuleState';

/**
 * Currency formatter.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class CurrencyFormatter {
    private readonly store?: Store<I18nModuleState>;

    public constructor(store?: Store<I18nModuleState>) {
        this.store = store;
    }

    public format(value: number, currency?: string): string {
        const locale = this.store ? this.store.state.i18n.locale : undefined;

        return new Intl.NumberFormat(locale, {style: 'currency', currency}).format(value);
    }
}
