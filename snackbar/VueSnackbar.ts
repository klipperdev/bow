/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {SnackbarManager} from '@klipper/bow/snackbar/SnackbarManager';
import _Vue, {PluginObject} from 'vue';

/**
 * Snackbar vue plugin.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default class VueSnackbar implements PluginObject<SnackbarManager> {
    private readonly manager: SnackbarManager;

    constructor(manager?: SnackbarManager) {
        this.manager = manager || new SnackbarManager();
    }

    public install(Vue: typeof _Vue): void {
        Vue.prototype.$snackbar = this.manager;
    }
}
