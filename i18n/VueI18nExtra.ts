/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import _Vue, {PluginObject} from 'vue';
import {VueI18nExtraOptions} from '@klipper/bow/i18n/VueI18nExtraOptions';
import {NumberFormatter} from '@klipper/bow/i18n/NumberFormatter';
import {DateFormatter} from '@klipper/bow/i18n/DateFormatter';
import {CountryFormatter} from '@klipper/bow/i18n/CountryFormatter';
import {LocaleFormatter} from '@klipper/bow/i18n/LocaleFormatter';

/**
 * I18n extra vue plugin.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default class VueI18nExtra implements PluginObject<VueI18nExtraOptions> {
    private readonly dateFormatter: DateFormatter;

    private readonly numberFormatter: NumberFormatter;

    private readonly countryFormatter: CountryFormatter;

    private readonly localeFormatter: LocaleFormatter;

    constructor(options?: VueI18nExtraOptions) {
        options = options || {};
        this.dateFormatter = options.dateFormatter || new DateFormatter();
        this.numberFormatter = options.numberFormatter || new NumberFormatter();
        this.countryFormatter = options.countryFormatter || new CountryFormatter();
        this.localeFormatter = options.localeFormatter || new LocaleFormatter();
    }

    public install(Vue: typeof _Vue): void {
        Vue.prototype.$dateFormatter = this.dateFormatter;
        Vue.prototype.$numberFormatter = this.numberFormatter;
        Vue.prototype.$countryFormatter = this.countryFormatter;
        Vue.prototype.$localeFormatter = this.localeFormatter;

        Vue.prototype.$date = (value?: string | number,
                               format?: string,
                               inputFormat?: string): string|undefined => {
            return this.dateFormatter.date(value, format, inputFormat);
        };

        Vue.prototype.$time = (value?: string | number,
                               format?: string,
                               inputFormat?: string): string|undefined => {
            return this.dateFormatter.time(value, format, inputFormat);
        };

        Vue.prototype.$datetime = (value?: string | number,
                                   format?: string,
                                   inputFormat?: string): string|undefined => {
            return this.dateFormatter.dateTime(value, format, inputFormat);
        };

        Vue.prototype.$number = (value?: number, scale?: number): string|undefined => {
            return this.numberFormatter.number(value, scale);
        };

        Vue.prototype.$percent = (value?: number, scale?: number): string|undefined => {
            return this.numberFormatter.percent(value, scale);
        };

        Vue.prototype.$currency = (value?: number, scale?: number, currency?: string, display: string = 'symbol'): string|undefined => {
            return this.numberFormatter.currency(value, scale, currency);
        };

        Vue.prototype.$country = (isoCode?: string): string|undefined => {
            return this.countryFormatter.country(isoCode);
        };
    }
}
