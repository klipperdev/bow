/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {DataTransformer} from '@klipper/bow/dataTransformer/DataTransformer';
import _Vue, {PluginObject} from 'vue';

/**
 * Data transformer vue plugin.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default class VueDataTransformer implements PluginObject<DataTransformer> {
    private readonly dataTransformer: DataTransformer;

    constructor(dataTransformer?: DataTransformer) {
        this.dataTransformer = dataTransformer || new DataTransformer();
    }

    public install(Vue: typeof _Vue): void {
        Vue.prototype.$dataTransformer = this.dataTransformer;
    }
}
