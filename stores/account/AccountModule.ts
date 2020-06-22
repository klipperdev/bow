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
import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';
import {AuthModuleState} from '../auth/AuthModuleState';
import {User} from '../../account/User';
import {Organization} from '../../account/Organization';
import {AccountModuleState} from './AccountModuleState';
import {AccountState} from './AccountState';
import {InitSuccess} from './InitSuccess';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class AccountModule<R extends AccountModuleState&AuthModuleState> implements Module<AccountState, R> {
    private readonly client: KlipperClient;

    private readonly onlyOrganizations: boolean;

    private readonly storage: Storage;

    private previousRequests: Canceler[] = [];

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
            currentOrganization: undefined,
            totalOrganizations: 0,
            searchOrganization: '',
            organizations: [],
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
                state.currentOrganization = payload.currentOrganization;
                state.totalOrganizations = payload.totalOrganizations;
                state.searchOrganization = '';
                state.organizations = payload.organizations || [];
            },
            initializeError(state: AccountState): void {
                state.initialized = true;
                state.initializationPending = false;
            },
            reset(state: AccountState): void {
                state.initialized = false;
                state.initializationPending = false;
                state.user = undefined;
                state.currentOrganization = undefined;
                state.totalOrganizations = 0;
                state.searchOrganization = '';
                state.organizations = [];
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
                        for (const previousRequest of self.previousRequests) {
                            previousRequest.cancel();
                        }
                        self.previousRequests = [];

                        const cancelerUser = new Canceler();
                        const cancelerOrgs = new Canceler();
                        self.previousRequests.push(cancelerUser);
                        self.previousRequests.push(cancelerOrgs);

                        const res = await self.client.requestAll([
                            {config: {method: 'GET', url: '/user'}, canceler: cancelerUser},
                            {config: {method: 'GET', url: '/user/organizations', limit: 1000}, canceler: cancelerOrgs},
                        ]);
                        const resUser = res[0] as Partial<any>;
                        const resOrgs = res[1] as ListResponse;

                        if (resUser) {
                            const payload = {
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
                                totalOrganizations: resOrgs.total,
                                organizations: [] as Organization[],
                            } as InitSuccess;

                            for (const resOrg of resOrgs.results) {
                                const org = {
                                    id: resOrg.id,
                                    name: resOrg.name,
                                    label: resOrg.label,
                                } as Organization;
                                payload.organizations.push(org);

                                if (self.onlyOrganizations && !payload.currentOrganization) {
                                    payload.currentOrganization = org;
                                }
                            }

                            if (!payload.currentOrganization) {
                                payload.currentOrganization = {
                                    id: 'user',
                                    name: 'user',
                                    label: resUser.profile.full_name || resUser.username || resUser.email,
                                } as Organization;
                            }

                            const previousCurrentOrg = self.getCurrentOrg();

                            if (previousCurrentOrg) {
                                payload.currentOrganization = previousCurrentOrg;
                            }

                            self.storage.setItem('account:currentOrg', JSON.stringify(payload.currentOrganization));

                            commit('initializeSuccess', payload);
                        } else {
                            await dispatch('auth/logout', undefined, {root: true});
                            commit('initializeError');
                        }
                    } else {
                        commit('initializeError');
                    }
                } catch (e) {
                    await dispatch('auth/logout', undefined, {root: true});
                    commit('initializeError');
                }

                self.previousRequests = [];
            },
            async reset({commit}): Promise<void> {
                for (const previousRequest of self.previousRequests) {
                    previousRequest.cancel();
                }

                self.previousRequests = [];
                self.storage.removeItem('account:currentOrg');
                commit('reset');
            },
        };
    }

    private getCurrentOrg(): Organization|null {
        const previousCurrentOrg = this.storage.getItem('account:currentOrg');

        return previousCurrentOrg ? JSON.parse(previousCurrentOrg) : null;
    }
}
