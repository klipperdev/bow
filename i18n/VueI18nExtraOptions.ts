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
 * I18n extra vue plugin options.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface VueI18nExtraOptions {
    dateFormatter?: DateFormatter;
    numberFormatter?: NumberFormatter;
    countryFormatter?: CountryFormatter;
    localeFormatter?: LocaleFormatter;
}
