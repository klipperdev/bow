/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import moment from 'moment';
import VueI18n from 'vue-i18n';

/**
 * Date time formatter.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class DateFormatter {
    private readonly i18n?: VueI18n;

    public constructor(i18n?: VueI18n) {
        this.i18n = i18n;
    }

    public date(value?: string|number|Date, format?: string, inputFormat?: string): string|undefined {
        format = format ? format : 'L';

        return this.dateTime(value, format, inputFormat);
    }

    public time(value?: string|number|Date, format?: string, inputFormat?: string): string|undefined {
        format = format ? format : 'LTS';

        return this.dateTime(value, format, inputFormat);
    }

    public dateTime(value?: string|number|Date, format?: string, inputFormat?: string): string|undefined {
        format = format ? format : 'L LTS';

        return this.getMomentDate(value, inputFormat)?.format(format);
    }

    public dateFromNow(value?: string|number|Date, inputFormat?: string): string|undefined {
        return this.getMomentDate(value, inputFormat)?.fromNow();
    }

    public timezone(): string|undefined {
        return Intl && Intl.DateTimeFormat() && Intl.DateTimeFormat().resolvedOptions()
            ? Intl.DateTimeFormat().resolvedOptions().timeZone
            : undefined;
    }

    private getMomentDate(value?: string|number|Date, inputFormat?: string): moment.Moment|undefined {
        if (this.i18n) {
            moment.locale(this.i18n.locale);
        }

        if (typeof value === 'number') {
            return moment.unix(value);
        }

        return value ? moment(value, inputFormat) : undefined;
    }
}
