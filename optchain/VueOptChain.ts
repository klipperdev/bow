/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import _Vue, {PluginObject} from 'vue';
import {oc} from 'ts-optchain';

/**
 * Account vue plugin.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default class VueOptChain implements PluginObject<void> {
    public install(Vue: typeof _Vue): void {
        Vue.prototype.$oc = oc;
    }
}
