/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Store} from 'vuex';
import {MetadataModuleState} from '../stores/metadata/MetadataModuleState';
import {ObjectMetadata} from './ObjectMetadata';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class MetadataManager {
    private readonly store: Store<MetadataModuleState>;

    public constructor(store: Store<MetadataModuleState>) {
        this.store = store;
    }

    public async has(name: string): Promise<boolean> {
        if (!this.store.state.metadata.initialized) {
            await this.store.dispatch('metadata/initialize');
        }

        return undefined !== await this.get(name);
    }

    public async get(name: string): Promise<ObjectMetadata|undefined> {
        if (!this.store.state.metadata.initialized) {
            await this.store.dispatch('metadata/initialize');
        }

        return this.store.state.metadata.metadatas[name];
    }
}
