/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {I18nModuleState} from '@klipper/bow/stores/i18n/I18nModuleState';
import {DarkModeModuleState} from '@klipper/bow/stores/darkMode/DarkModeModuleState';
import {DrawerModuleState} from '@klipper/bow/stores/drawer/DrawerModuleState';
import {AuthModuleState} from '@klipper/bow/stores/auth/AuthModuleState';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface AppState extends
    DarkModeModuleState,
    DrawerModuleState,
    AuthModuleState,
    I18nModuleState {
}
