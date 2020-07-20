/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import VueI18n from 'vue-i18n';
import isoCountries, {LocaleData} from 'i18n-iso-countries';
import enCountries from 'i18n-iso-countries/langs/en.json';

/**
 * Country formatter.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class CountryFormatter {
    private readonly i18n?: VueI18n;

    public constructor(countryLocales: LocaleData[] = [], i18n?: VueI18n) {
        this.i18n = i18n;
        isoCountries.registerLocale(enCountries);

        for (const countryLocale of countryLocales) {
            isoCountries.registerLocale(countryLocale);
        }
    }

    public country(isoCode?: string): string|undefined {
        if (isoCode) {
            let locale = this.i18n ? this.i18n.locale : 'en';
            locale = isoCountries.langs().includes(locale) ? locale : 'en';

            return isoCountries.getName(isoCode, locale);
        }

        return undefined;
    }
}
