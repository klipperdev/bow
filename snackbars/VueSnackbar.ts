/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {SnackbarManager} from './SnackbarManager';
import _Vue, {PluginObject} from 'vue';

/**
 * Snackbar vue plugin.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default {
    install: (Vue: typeof _Vue, options?: SnackbarManager): void => {
        Vue.prototype.$snackbar = options;
    },
} as PluginObject<SnackbarManager>;
