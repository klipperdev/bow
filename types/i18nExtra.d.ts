/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {DateFormatter} from '@klipper/bow/i18n/DateFormatter';
import {NumberFormatter} from '@klipper/bow/i18n/NumberFormatter';
import {CountryFormatter} from '@klipper/bow/i18n/CountryFormatter';
import {LocaleFormatter} from '@klipper/bow/i18n/LocaleFormatter';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
declare module 'vue/types/vue' {
    interface Vue {
        $dateFormatter: DateFormatter;
        $numberFormatter: NumberFormatter;
        $countryFormatter: CountryFormatter;
        $localeFormatter: LocaleFormatter;

        $date: (value?: string | number,
                format?: string,
                inputFormat?: string) => string|undefined;

        $time: (value?: string | number,
                format?: string,
                inputFormat?: string) => string|undefined;

        $datetime: (value?: string | number,
                    format?: string,
                    inputFormat?: string) => string|undefined;

        $number: (value?: number, scale?: number) => string|undefined;

        $percent: (value?: number, scale?: number) => string|undefined;

        $currency: (value?: number, currency?: string, display: string = 'symbol') => string|undefined;

        $country: (isoCode?: string, fallback?: string) => string|undefined;

        $parseNumber: (value?: string, scale?: number) => number|undefined;
    }
}
