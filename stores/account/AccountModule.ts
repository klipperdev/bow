/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {ActionTree, GetterTree, Module, MutationTree} from 'vuex';
import {KlipperClient} from '@klipper/sdk/KlipperClient';
import {Canceler} from '@klipper/http-client/Canceler';
import {AuthModuleState} from '../auth/AuthModuleState';
import {AccountModuleState} from './AccountModuleState';
import {AccountState} from './AccountState';
import {InitSuccess} from './InitSuccess';
import {User} from './User';
import {createApiError} from '@klipper/sdk/utils/error';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class AccountModule<R extends AccountModuleState&AuthModuleState> implements Module<AccountState, R> {
    private readonly client: KlipperClient;

    private readonly onlyOrganizations: boolean;

    private readonly storage: Storage;

    private previousRequest?: Canceler;

    public constructor(client: KlipperClient, onlyOrganizations: boolean = true, storage?: Storage) {
        this.client = client;
        this.onlyOrganizations = onlyOrganizations;
        this.storage = storage ? storage : localStorage;
    }

    public get namespaced(): boolean {
        return true;
    }

    public get state(): AccountState {
        return {
            initialized: false,
            initializationPending: false,
            user: undefined,
            organization: this.storage.getItem('organization:last') || 'user',
        };
    }

    public get getters(): GetterTree<AccountState, R> {
        return {
            isOrganization(state: AccountState): boolean {
                return 'user' === state.organization;
            },
        };
    }

    public get mutations(): MutationTree<AccountState> {
        return {
            initialize(state: AccountState): void {
                state.initialized = false;
                state.initializationPending = true;
            },

            initializeSuccess(state: AccountState, payload: InitSuccess): void {
                state.initialized = true;
                state.initializationPending = false;
                state.user = payload.user;
                state.organization = payload.organization;
            },

            initializeError(state: AccountState): void {
                state.initialized = true;
                state.initializationPending = false;
            },

            reset(state: AccountState): void {
                state.initialized = false;
                state.initializationPending = false;
                state.user = undefined;
            },

            updateOrganization(state: AccountState, organization: string): void {
                state.organization = organization;
            },
        };
    }

    public get actions(): ActionTree<AccountState, R> {
        const self = this;

        return {
            async initialize({commit, state, rootState, dispatch}): Promise<void> {
                if (state.initializationPending) {
                    return;
                }

                commit('initialize');

                try {
                    if (rootState.auth.authenticated) {
                        if (self.previousRequest) {
                            self.previousRequest.cancel();
                        }

                        self.previousRequest = new Canceler();

                        const resUser = await self.client.request({url: '/user'}, self.previousRequest);

                        if (resUser) {
                            commit('initializeSuccess', {
                                user: {
                                    id: resUser.id,
                                    username: resUser.username,
                                    email: resUser.email,
                                    firstName: resUser.profile.first_name,
                                    lastName: resUser.profile.last_name,
                                    fullName: resUser.profile.full_name,
                                    initial: resUser.profile.initial as string,
                                    imageUrl: resUser.profile.image_url,
                                } as User,
                                organization: state.organization,
                            } as InitSuccess);
                            self.storage.setItem('organization:last', state.organization);
                        } else {
                            await dispatch('auth/logout', undefined, {root: true});
                            commit('initializeError');
                        }
                    } else {
                        commit('initializeError');
                    }
                } catch (e) {
                    const error = createApiError(e);

                    if (error.statusCode >= 400) {
                        await dispatch('auth/logout', undefined, {root: true});
                    }

                    commit('initializeError');
                }

                self.previousRequest = undefined;
            },

            async setOrganization({commit, state}, organization: string): Promise<void> {
                self.storage.setItem('organization:last', organization);
                commit('updateOrganization', organization);
            },

            async reset({commit}): Promise<void> {
                if (self.previousRequest) {
                    self.previousRequest.cancel();
                }

                self.previousRequest = undefined;
                self.storage.removeItem('organization:last');
                commit('reset');
            },
        };
    }
}
