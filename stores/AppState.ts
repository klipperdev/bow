/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {I18nModuleState} from './i18n/I18nModuleState';
import {DarkModeModuleState} from './darkMode/DarkModeModuleState';
import {DrawerModuleState} from './drawer/DrawerModuleState';
import {AuthModuleState} from './auth/AuthModuleState';
import {AccountModuleState} from './account/AccountModuleState';
import {MetadataModuleState} from './metadata/MetadataModuleState';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface AppState extends
    DarkModeModuleState,
    DrawerModuleState,
    AuthModuleState,
    AccountModuleState,
    I18nModuleState,
    MetadataModuleState {
}
