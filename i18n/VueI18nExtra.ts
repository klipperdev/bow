/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {CountryFormatter} from '@klipper/bow/i18n/CountryFormatter';
import {DateFormatter} from '@klipper/bow/i18n/DateFormatter';
import {LocaleFormatter} from '@klipper/bow/i18n/LocaleFormatter';
import {NumberFormatter} from '@klipper/bow/i18n/NumberFormatter';
import {VueI18nExtraOptions} from '@klipper/bow/i18n/VueI18nExtraOptions';
import _Vue, {PluginObject} from 'vue';

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

        Vue.prototype.$date = (value?: string|number|Date, format?: string, inputFormat?: string): string|undefined => {
            return this.dateFormatter.date(value, format, inputFormat);
        };

        Vue.prototype.$time = (value?: string|number|Date, format?: string, inputFormat?: string): string|undefined => {
            return this.dateFormatter.time(value, format, inputFormat);
        };

        Vue.prototype.$datetime = (value?: string|number|Date, format?: string, inputFormat?: string): string|undefined => {
            return this.dateFormatter.dateTime(value, format, inputFormat);
        };

        Vue.prototype.$dateFromNow = (value?: string|number|Date, inputFormat?: string): string|undefined => {
            return this.dateFormatter.dateFromNow(value, inputFormat);
        };

        Vue.prototype.$timezone = (): string|undefined => {
            return this.dateFormatter.timezone();
        };

        Vue.prototype.$number = (value?: number|string, scale?: number): string|undefined => {
            return this.numberFormatter.number(value, scale);
        };

        Vue.prototype.$numberByteSize = (value?: number|string, scale?: number): string|undefined => {
            return this.numberFormatter.numberByteSize(value, scale);
        };

        Vue.prototype.$percent = (value?: number|string, scale?: number): string|undefined => {
            return this.numberFormatter.percent(value, scale);
        };

        Vue.prototype.$currency = (value?: number|string, scale?: number, currency?: string, display: string = 'symbol'): string|undefined => {
            return this.numberFormatter.currency(value, scale, currency, display);
        };

        Vue.prototype.$country = (isoCode?: string, fallback?: string): string|undefined => {
            return this.countryFormatter.country(isoCode) || fallback;
        };

        Vue.prototype.$parseNumber = (value?: string, scale?: number): number|undefined => {
            return this.numberFormatter.parseNumber(value, scale);
        };
    }
}
