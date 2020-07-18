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
    public static labelize(name: string): string {
        return name
            .replace(/_|-]/g, ' ')
            .replace(/\w\S*/g, (txt): string => {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            })
        ;
    }

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

    public getPluralName(name: string): string {
        if (this.store.state.metadata.metadatas[name]) {
            return this.store.state.metadata.metadatas[name].pluralName;
        }

        return name;
    }

    public getLabel(name: string): string {
        if (this.store.state.metadata.metadatas[name]) {
            return this.store.state.metadata.metadatas[name].label;
        }

        return MetadataManager.labelize(name);
    }

    public getPluralLabel(name: string): string {
        if (this.store.state.metadata.metadatas[name]) {
            return this.store.state.metadata.metadatas[name].pluralLabel;
        }

        return MetadataManager.labelize(name);
    }
}