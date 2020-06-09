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
            light: {
                primary: '#384d76',
                secondary: '#4d89a0',
                accent: '#1e88e5',
                error: '#f44336',
                warning: '#f9a825',
                info: '#4fc3f7',
                success: '#4caf50',
            },
            dark: {
                primary: '#6185cc',
                secondary: '#4d89a0',
                accent: '#1e88e5',
                error: '#f44336',
                warning: '#f9a825',
                info: '#4fc3f7',
                success: '#4caf50',
            },
        },
    },
} as Partial<UserVuetifyPreset>;
