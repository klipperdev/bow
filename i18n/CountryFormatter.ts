/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {Country} from '@klipper/bow/i18n/Country';
import isoCountries, {LocaleData} from 'i18n-iso-countries';
import enCountries from 'i18n-iso-countries/langs/en.json';
import VueI18n from 'vue-i18n';

/**
 * Country formatter.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class CountryFormatter {
    private readonly i18n?: VueI18n;

    private cache: Dictionary<Country[]> = {} as Dictionary<Country[]>;

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

    public countries(): Country[] {
        const locale = this.i18n ? this.i18n.locale : 'en';

        if (this.cache[locale]) {
            return this.cache[locale];
        }

        const countries = isoCountries.getNames(locale);
        const values = [] as Country[];
        this.cache = {};

        Object.keys(countries).forEach((code: string) => {
            values.push({
                code,
                name: countries[code],
            } as Country);
        });

        values.sort((a: Country, b: Country) => {
            if (a.name < b.name) {
                return -1;
            } else if (a.name > b.name) {
                return 1;
            }

            return 0;
        });

        this.cache[locale] = values;

        return values;
    }
}
