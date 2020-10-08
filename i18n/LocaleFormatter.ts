/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AvailableLocale} from '@klipper/bow/i18n/AvailableLocale';

/**
 * Locale formatter.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class LocaleFormatter {
    public getAvailableLocales(locale: string, selectedLocale: string, availableLocales: string[]): AvailableLocale[] {
        const values: string[] = Object.assign([], availableLocales);
        const dn = new (Intl as any).DisplayNames([locale], {
            type: 'language',
            style: 'long',
        });
        const locales: AvailableLocale[] = [];

        if (0 === values.length) {
            values.push(selectedLocale);
        }

        values.forEach((locale: string) => {
            const name = dn.of(locale);

            locales.push({
                code: locale,
                name: name.charAt(0).toUpperCase() + name.slice(1),
            });
        });

        locales.sort((a: AvailableLocale, b: AvailableLocale) => {
            return a.name.localeCompare(b.name);
        });

        return locales;
    }
}
