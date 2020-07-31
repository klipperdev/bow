/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import VueI18n from 'vue-i18n';

/**
 * Number formatter.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class NumberFormatter {
    private readonly i18n?: VueI18n;

    private readonly defaultCurrency: string;

    public constructor(i18n?: VueI18n, defaultCurrency: string = 'EUR') {
        this.i18n = i18n;
        this.defaultCurrency = defaultCurrency;
    }

    public number(value?: number, scale?: number): string|undefined {
        if (value) {
            value = 0 === scale ? Math.round(value) : value;

            return value.toLocaleString(this.i18n ? this.i18n.locale : undefined, {
                minimumFractionDigits: scale && scale >= 0 ? scale : undefined,
                maximumFractionDigits: scale && scale > 0 ? scale : undefined,
            });
        }

        return undefined;
    }

    public percent(value?: number, scale?: number): string|undefined {
        if (value) {
            value = 0 === scale ? Math.round(value) : value;

            return value.toLocaleString(this.i18n ? this.i18n.locale : undefined, {
                style: 'percent',
                minimumFractionDigits: scale && scale >= 0 ? scale : undefined,
                maximumFractionDigits: scale && scale > 0 ? scale : undefined,
            });
        }

        return undefined;
    }

    public currency(value?: number, scale?: number, currency?: string, display: string = 'symbol'): string|undefined {
        if (value) {
            value = 0 === scale ? Math.round(value) : value;

            return value.toLocaleString(this.i18n ? this.i18n.locale : undefined, {
                style: 'currency',
                currency: currency || this.defaultCurrency,
                currencyDisplay: display,
                minimumFractionDigits: scale && scale >= 0 ? scale : undefined,
                maximumFractionDigits: scale && scale > 0 ? scale : undefined,
            });
        }

        return undefined;
    }
}
