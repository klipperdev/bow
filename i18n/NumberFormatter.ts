/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import VueI18n from 'vue-i18n';

/**
 * Number formatter.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class NumberFormatter {
    private readonly i18n?: VueI18n;

    private readonly defaultCurrency: string;

    private cacheSizes: Dictionary<Array<string>> = {};

    public constructor(i18n?: VueI18n, defaultCurrency: string = 'EUR') {
        this.i18n = i18n;
        this.defaultCurrency = defaultCurrency;
    }

    public number(value?: number|string, scale?: number): string|undefined {
        if (undefined !== value) {
            if (typeof value === 'string') {
                return value;
            }

            value = undefined !== scale ? parseFloat(value.toFixed(scale)) : value;

            return value.toLocaleString(this.i18n ? this.i18n.locale : undefined, {
                minimumFractionDigits: undefined !== scale && scale >= 0 ? scale : undefined,
                maximumFractionDigits: undefined !== scale && scale > 0 ? scale : undefined,
            });
        }

        return undefined;
    }

    public numberByteSize(value?: number|string, scale?: number): string|undefined {
        if (undefined === value || 0 === value) {
            return undefined;
        }

        value = Number(value);
        const locale = this.i18n?.locale ?? 'en';

        if (!this.cacheSizes[locale]) {
            const defaultSizes = ['Bytes', 'Kb', 'Mb', 'Gb', 'Tb'];
            this.cacheSizes[locale] = defaultSizes;

            if (this.i18n) {
                for (const i in defaultSizes) {
                    if (!!this.i18n.messages[locale]['byte-sizes.' + defaultSizes[i]]) {
                        this.cacheSizes[locale][i] = this.i18n.t('byte-sizes.' + defaultSizes[i]) as string;
                    }
                }
            }
        }

        const sizes: string[] = this.cacheSizes[locale];

        const i: number = parseInt(Math.floor(Math.log(value) / Math.log(1024)).toString());

        if (i === 0) {
            return `${this.number(value, 0)} ${sizes[i]}`;
        }

        return `${this.number((value / Math.pow(1024, i)), scale)} ${sizes[i]}`;
    }

    public percent(value?: number|string, scale?: number): string|undefined {
        if (undefined !== value) {
            if (typeof value === 'string') {
                return value;
            }

            value = 0 === scale ? Math.round(value) : value;

            return value.toLocaleString(this.i18n ? this.i18n.locale : undefined, {
                style: 'percent',
                minimumFractionDigits: undefined !== scale && scale >= 0 ? scale : undefined,
                maximumFractionDigits: undefined !== scale && scale > 0 ? scale : undefined,
            });
        }

        return undefined;
    }

    public currency(value?: number|string, scale?: number, currency?: string, display: string = 'symbol'): string|undefined {
        if (undefined !== value) {
            if (typeof value === 'string') {
                return value;
            }

            value = undefined !== scale ? parseFloat(value.toFixed(scale)) : value;

            return value.toLocaleString(this.i18n ? this.i18n.locale : undefined, {
                style: 'currency',
                currency: currency || this.defaultCurrency,
                currencyDisplay: display,
                minimumFractionDigits: undefined !== scale && scale >= 0 ? scale : undefined,
                maximumFractionDigits: undefined !== scale && scale > 0 ? scale : undefined,
            });
        }

        return undefined;
    }

    public parseNumber(value?: string, scale?: number): number|undefined {
        if (undefined === value) {
            return undefined;
        }

        const locale = this.i18n ? this.i18n.locale : undefined;

        const thousandSeparator = (1111).toLocaleString(locale).replace(/1/g, '');
        const decimalSeparator = (1.1).toLocaleString(locale).replace(/1/g, '');

        value = value
            .replace(new RegExp('\\' + thousandSeparator, 'g'), '')
            .replace(new RegExp('\\' + decimalSeparator), '.');

        let numberValue = parseFloat(value);

        if (typeof scale === 'number') {
            numberValue = parseFloat(numberValue.toFixed(scale));
        }

        return isNaN(numberValue) ? undefined : numberValue;
    }
}
