/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {ObjectMetadata} from '@klipper/bow/metadata/ObjectMetadata';
import {SystemChoice} from '@klipper/bow/metadata/SystemChoice';
import {MetadataModuleState} from '@klipper/bow/stores/metadata/MetadataModuleState';
import {Store} from 'vuex';

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

    public getFieldLabel(object: string, field: string): string {
        if (this.store.state.metadata.metadatas[object]
                && this.store.state.metadata.metadatas[object].fields[field]) {
            return this.store.state.metadata.metadatas[object].fields[field].label;
        }

        return MetadataManager.labelize(field);
    }

    public getAssociationLabel(object: string, association: string): string {
        if (this.store.state.metadata.metadatas[object]
                && this.store.state.metadata.metadatas[object].associations[association]) {
            return this.store.state.metadata.metadatas[object].associations[association].label;
        }

        return MetadataManager.labelize(association);
    }

    public getFieldOrAssociationLabel(object: string, field: string): string {
        if (this.store.state.metadata.metadatas[object]
            && this.store.state.metadata.metadatas[object].fields[field]) {
            return this.store.state.metadata.metadatas[object].fields[field].label;
        }

        if (this.store.state.metadata.metadatas[object]
            && this.store.state.metadata.metadatas[object].associations[field]) {
            return this.store.state.metadata.metadatas[object].associations[field].label;
        }

        return MetadataManager.labelize(field);
    }

    public isTranslatable(object: string): boolean {
        return this.store.state.metadata.metadatas[object] && this.store.state.metadata.metadatas[object].translatable;
    }

    public isFieldRequired(object: string, field: string): boolean {
        return this.store.state.metadata.metadatas[object]?.fields[field]?.required || false;
    }

    public isAssociationRequired(object: string, association: string): boolean {
        return this.store.state.metadata.metadatas[object]?.associations[association]?.required || false;
    }

    public isFieldOrAssociationRequired(object: string, field: string): boolean {
        return this.isFieldRequired(object, field) || this.isAssociationRequired(object, field);
    }

    public getSystemChoices(type: string): SystemChoice[] {
        return this.store?.state?.metadata?.systemChoices[type] ?? [];
    }

    public getSystemChoice(type: string, value: string|null|undefined): SystemChoice|undefined {
        if (!!value) {
            for (const sysChoice of this.getSystemChoices(type)) {
                if (value === sysChoice.value) {
                    return sysChoice;
                }
            }
        }

        return undefined;
    }

    public getSystemChoiceLabel(type: string, value: string|null|undefined): string|null|undefined {
        const sysChoice = this.getSystemChoice(type, value);

        return sysChoice ? sysChoice.label : value;
    }

    public getSystemChoiceLabelForField(object: string, field: string, value: string|null|undefined): string|null|undefined {
        const choices = this.store.state.metadata?.metadatas[object]?.fields[field]?.inputConfig?.choices;

        return typeof choices === 'string'
            ? this.getSystemChoiceLabel(choices.substring(10), value)
            : value;
    }
}
