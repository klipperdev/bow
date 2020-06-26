/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Get the available locale.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function getLocale(locales: string[], currentLocale: string, fallbackLocale: string): string {
    let locale = currentLocale;

    if (locales.includes(locale)) {
        return locale;
    }

    locale = locale.replace('-', '_');

    if (locale.indexOf('_') >= 0) {
        locale = locale.substr(0, locale.indexOf('_'));
    }

    if (locales.includes(locale)) {
        return locale;
    }

    // fallback
    locale = fallbackLocale.replace('-', '_');

    if (locales.includes(locale)) {
        return locale;
    }

    if (locale.indexOf('_') >= 0) {
        locale = locale.substr(0, locale.indexOf('_'));
    }

    return locale;
}
