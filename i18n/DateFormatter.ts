/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import moment from 'moment';

/**
 * Date formatter.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class DateFormatter {
    public format(date: string | number,
                  format: string = 'L',
                  inputFormat: string = 'YYYYMMDD'): string {
        if (typeof date === 'number') {
            return moment.unix(date).format(format);
        }

        return moment(date, inputFormat).format(format);
    }
}
