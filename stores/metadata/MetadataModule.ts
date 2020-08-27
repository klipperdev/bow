/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {ActionTree, Module, MutationTree} from 'vuex';
import {KlipperClient} from '@klipper/sdk/KlipperClient';
import {Canceler} from '@klipper/http-client/Canceler';
import {CancelerBag} from '@klipper/http-client/CancelerBag';
import {MapKey} from '@klipper/http-client/models/MapKey';
import {Metadata} from '@klipper/sdk/services/Metadata';
import {ObjectMetadataDetailsResponse} from '@klipper/sdk/models/responses/metadata/ObjectMetadataDetailsResponse';
import {FieldMetadata} from '@klipper/bow/metadata/FieldMetadata';
import {AssociationMetadata} from '@klipper/bow/metadata/AssociationMetadata';
import {AccountModuleState} from '@klipper/bow/stores/account/AccountModuleState';
import {ObjectMetadata} from '@klipper/bow/metadata/ObjectMetadata';
import {AuthModuleState} from '@klipper/bow/stores/auth/AuthModuleState';
import {MetadataModuleState} from '@klipper/bow/stores/metadata/MetadataModuleState';
import {MetadataState} from '@klipper/bow/stores/metadata/MetadataState';
import {InitSuccess} from '@klipper/bow/stores/metadata/InitSuccess';
import {deepMerge} from '@klipper/bow/utils/object';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class MetadataModule<R extends MetadataModuleState&AccountModuleState&AuthModuleState> implements Module<MetadataState, R> {

    private static convertObjectMetadataResponses(responseMetadatas: ObjectMetadataDetailsResponse[]): MapKey<ObjectMetadata> {
        const res = {} as MapKey;

        for (const resMeta of responseMetadatas) {
            const name = resMeta.name;

            res[name] = {
                name: resMeta.name,
                pluralName: resMeta.plural_name,
                label: resMeta.label,
                pluralLabel: resMeta.plural_label,
                sortable: resMeta.sortable,
                multiSortable: resMeta.multi_sortable,
                defaultSortable: resMeta.default_sortable,
                filterable: resMeta.filterable,
                searchable: resMeta.searchable,
                translatable: resMeta.translatable,
                availableContexts: resMeta.available_contexts,
                fieldIdentifier: resMeta.field_identifier,
                fieldLabel: resMeta.field_label,
                editablePermissions: resMeta.editable_permissions,
                master: resMeta.master,
                availableActions: resMeta.available_actions,
                fields: {},
                associations: {},
            } as ObjectMetadata;

            for (const resField of resMeta.fields || []) {
                const fieldName = resField.name;

                res[name].fields[fieldName] = {
                    name: fieldName,
                    type: resField.type,
                    label: resField.label,
                    readOnly: resField.read_only,
                    required: resField.required,
                    input: resField.input,
                    inputConfig: Object.assign({}, resField.input_config),
                    editablePermissions: resField.editable_permissions,
                    filterable: resField.filterable,
                    searchable: resField.searchable,
                    translatable: resField.translatable,
                } as FieldMetadata;
            }

            for (const resAsso of resMeta.associations || []) {
                const assoName = resAsso.name;

                res[name].associations[assoName] = {
                    name: assoName,
                    type: resAsso.type,
                    label: resAsso.label,
                    readOnly: resAsso.read_only,
                    required: resAsso.required,
                    input: resAsso.input,
                    inputConfig: Object.assign({}, resAsso.input_config),
                    editablePermissions: resAsso.editable_permissions,
                    target: resAsso.target,
                    masterDetails: resAsso.master_details,
                } as AssociationMetadata;
            }
        }

        return res;
    }

    private readonly client: KlipperClient;

    private readonly storage: Storage;

    private previousRequests: CancelerBag = new CancelerBag();

    public constructor(client: KlipperClient, storage?: Storage) {
        this.client = client;
        this.storage = storage ? storage : localStorage;
    }

    public get namespaced(): boolean {
        return true;
    }

    public get state(): MetadataState {
        return {
            initialized: false,
            initializationPending: false,
            metadatas: {},
        };
    }

    public get mutations(): MutationTree<MetadataState> {
        return {
            initialize(state: MetadataState): void {
                state.initialized = false;
                state.initializationPending = true;
            },

            initializeSuccess(state: MetadataState, payload: InitSuccess): void {
                state.initialized = true;
                state.initializationPending = false;
                const newValue = {};
                deepMerge<ObjectMetadata>(newValue, payload.metadatas);
                state.metadatas = newValue;
            },

            initializeError(state: MetadataState): void {
                state.initialized = true;
                state.initializationPending = false;
            },

            reset(state: MetadataState): void {
                state.initialized = false;
                state.initializationPending = false;
                state.metadatas = {};
            },
        };
    }

    public get actions(): ActionTree<MetadataState, R> {
        const self = this;

        return {
            async initialize({commit, state, rootState}): Promise<void> {
                if (state.initializationPending) {
                    return;
                }

                const canceler = new Canceler();
                commit('initialize');

                try {
                    if (rootState.auth.authenticated) {
                        self.previousRequests.cancelAll();
                        self.previousRequests.add(canceler);

                        const resMetadatas = await self.client.get<Metadata>(Metadata).allDetails(rootState.account.organization);

                        if (resMetadatas) {
                            commit('initializeSuccess', {
                                metadatas: MetadataModule.convertObjectMetadataResponses(resMetadatas),
                            } as InitSuccess);
                        } else {
                            commit('initializeError');
                        }
                    } else {
                        commit('initializeError');
                    }
                } catch (e) {
                    commit('initializeError');
                }

                self.previousRequests.remove(canceler);
            },

            async reset({commit}): Promise<void> {
                self.previousRequests.cancelAll();
                commit('reset');
            },
        };
    }
}
