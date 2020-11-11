/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Klipper} from '@klipper/bow/klipper/Klipper';
import _Vue, {PluginObject} from 'vue';

/**
 * Klipper vue plugin.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default class VueKlipper implements PluginObject<Klipper> {
    private readonly klipper: Klipper;

    constructor(klipper: Klipper) {
        this.klipper = klipper;
    }

    public install(Vue: typeof _Vue): void {
        Vue.prototype.$klipper = this.klipper;
    }
}
