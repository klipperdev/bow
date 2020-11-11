/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Uploader} from '@klipper/bow/uploader/Uploader';
import _Vue, {PluginObject} from 'vue';

/**
 * Formatter vue plugin.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default class VueUploader implements PluginObject<Uploader> {
    private readonly uploader: Uploader;

    constructor(uploader: Uploader) {
        this.uploader = uploader;
    }

    public install(Vue: typeof _Vue): void {
        Vue.prototype.$uploader = this.uploader;
    }
}
