/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import _Vue, {PluginObject} from 'vue';
import {Store} from 'vuex';
import {MetadataManager} from './MetadataManager';
import {MetadataModuleState} from '../stores/metadata/MetadataModuleState';

/**
 * I18n extra vue plugin.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default class VueMetadata<S extends MetadataModuleState = MetadataModuleState> implements PluginObject<MetadataManager> {
    private readonly metadataManager: MetadataManager;

    constructor(store: Store<S>) {
        this.metadataManager = new MetadataManager(store);
    }

    public install(Vue: typeof _Vue): void {
        const self = this;

        Object.defineProperty(Vue.prototype, '$metadata', {
            get(this: Vue): MetadataManager {
                return self.metadataManager;
            },
        });
    }
}