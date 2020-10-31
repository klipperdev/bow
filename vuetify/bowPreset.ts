/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {UserVuetifyPreset} from 'vuetify/types/services/presets';

export default {
    icons: {
        iconfont: 'md',
    },
    theme: {
        themes: {
            light: Object.assign({}, APP_CONFIG.themes.light),
            dark: Object.assign({}, APP_CONFIG.themes.dark),
        },
    },
} as UserVuetifyPreset;
