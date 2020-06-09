/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {CurrencyFormatter} from './CurrencyFormatter';
import {DateFormatter} from './DateFormatter';

/**
 * I18n extra vue plugin options.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface VueI18nExtraOptions {
    dateFormatter?: DateFormatter;
    currencyFormatter?: CurrencyFormatter;
}
