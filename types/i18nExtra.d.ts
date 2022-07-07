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

        $timezone: () => string|undefined;

        $number: (value?: number|string, scale?: number) => string|undefined;

        $numberByteSize: (value?: number|string, scale?: number) => string|undefined;

        $percent: (value?: number|string, scale?: number) => string|undefined;

        $currency: (value?: number|string, scale?: number, currency?: string, display: string = 'symbol') => string|undefined;

        $country: (isoCode?: string, fallback?: string) => string|undefined;

        $parseNumber: (value?: string, scale?: number) => number|undefined;
    }
}
