/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import _Vue, {PluginObject} from 'vue';
import {VueI18nExtraOptions} from './VueI18nExtraOptions';
import {CurrencyFormatter} from './CurrencyFormatter';
import {DateFormatter} from './DateFormatter';
import {Formatter} from '../formatter/Formatter';

/**
 * I18n extra vue plugin.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default class VueI18nExtra implements PluginObject<Formatter> {
    private readonly dateFormatter: DateFormatter;
    private readonly currencyFormatter: CurrencyFormatter;

    constructor(options?: VueI18nExtraOptions) {
        options = options || {};
        this.dateFormatter = options.dateFormatter || new DateFormatter();
        this.currencyFormatter = options.currencyFormatter || new CurrencyFormatter();
    }

    public install(Vue: typeof _Vue): void {
        Vue.prototype.$fd = (date: string | number,
                             format: string = 'L',
                             inputFormat: string = 'YYYYMMDD'): string => {
            return this.dateFormatter.format(date, format, inputFormat);
        };

        Vue.prototype.$fc = (value: number, currency?: string): string => {
            return this.currencyFormatter.format(value, currency);
        };
    }
}
