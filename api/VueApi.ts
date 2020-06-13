/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import _Vue, {PluginObject} from 'vue';
import {KlipperClient} from '@klipper/sdk/KlipperClient';

/**
 * API vue plugin.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default class VueApi implements PluginObject<KlipperClient> {
    private readonly client: KlipperClient;

    constructor(client?: KlipperClient) {
        this.client = client || new KlipperClient({baseUrl: APP_CONFIG.api.url});
    }

    public install(Vue: typeof _Vue): void {
        Vue.prototype.$api = this.client;
    }
}
