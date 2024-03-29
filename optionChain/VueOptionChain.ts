/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {oc} from './proxy';
import _Vue, {PluginObject} from 'vue';

/**
 * Option Chain vue plugin.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default class VueOptionChain implements PluginObject<void> {
    public install(Vue: typeof _Vue): void {
        Vue.prototype.$oc = oc;
    }
}
