/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AccountModuleState} from '@klipper/bow/stores/account/AccountModuleState';
import {AccountState} from '@klipper/bow/stores/account/AccountState';
import {InitSuccess} from '@klipper/bow/stores/account/InitSuccess';
import {Organization} from '@klipper/bow/stores/account/Organization';
import {User} from '@klipper/bow/stores/account/User';
import {AuthModuleState} from '@klipper/bow/stores/auth/AuthModuleState';
import {deepMerge} from '@klipper/bow/utils/object';
import {Canceler} from '@klipper/http-client/Canceler';
import {CancelerBag} from '@klipper/http-client/CancelerBag';
import {KlipperClient} from '@klipper/sdk/KlipperClient';
import {ActionTree, GetterTree, Module, MutationTree} from 'vuex';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class AccountModule<R extends AccountModuleState&AuthModuleState> implements Module<AccountState, R> {
    private readonly client: KlipperClient;

    private readonly onlyOrganizations: boolean;

    private readonly storage: Storage;

    private previousRequests: CancelerBag = new CancelerBag();

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
            userUnauthorized: false,
            organization: this.storage.getItem('organization:last') || 'user',
            organizationPending: false,
            organizationError: false,
            organizationSwitcherOpen: false,
            organizationInfo: undefined,
        };
    }

    public get getters(): GetterTree<AccountState, R> {
        return {
            isOrganization(state: AccountState): boolean {
                return 'user' !== state.organization;
            },
            hasOrganizationInfo(state: AccountState): boolean {
                return !!state.organizationInfo;
            },
            hasOrganizationImage(state: AccountState): boolean {
                return !!state.organizationInfo && !!state.organizationInfo.imageUrl;
            },
            getContext(state: AccountState): string {
                return 'user' === state.organization ? 'user' : 'organization';
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
                state.userUnauthorized = false;
                state.organization = payload.organization;
            },

            initializeError(state: AccountState, userUnauthorized: boolean): void {
                state.initialized = true;
                state.initializationPending = false;
                state.userUnauthorized = userUnauthorized;
            },

            reset(state: AccountState): void {
                state.initialized = false;
                state.initializationPending = false;
                state.user = undefined;
                state.userUnauthorized = false;
                state.organizationPending = false;
                state.organizationError = false;
                state.organizationInfo = undefined;
            },

            refreshUser(state: AccountState): void {
                if (state.user) {
                    state.user.imageUrl = undefined;
                }
            },

            refreshUserSuccess(state: AccountState, payload: User): void {
                state.user = payload;
                state.userUnauthorized = false;
            },

            refreshUserError(state: AccountState, previousImageUrl?: string): void {
                if (state.user) {
                    state.user.imageUrl = previousImageUrl;
                }
            },

            updateOrganization(state: AccountState, organization: string): void {
                state.organization = organization;
            },

            updateOrganizationInfo(state: AccountState): void {
                if (!!state.organizationInfo) {
                    state.organizationInfo.imageUrl = undefined;
                }

                state.organizationPending = true;
                state.organizationError = false;
            },

            updateOrganizationInfoSuccess(state: AccountState, payload?: Organization): void {
                state.organizationInfo = payload;
                state.organizationPending = false;
                state.organizationError = false;
            },

            updateOrganizationInfoError(state: AccountState, previousImageUrl?: string): void {
                if (!!state.organizationInfo) {
                    state.organizationInfo.imageUrl = previousImageUrl;
                }

                state.organizationPending = false;
                state.organizationError = true;
            },
            toggleOrganizationSwitcher(state: AccountState): void {
                state.organizationSwitcherOpen = !state.organizationSwitcherOpen;
            },
            syncState(state: AccountState, newState: AccountState): void {
                if (state.user && newState.user) {
                    state.user = deepMerge<User>(state.user, newState.user) as User;
                }

                state.userUnauthorized = newState.userUnauthorized;

                if (newState.organization) {
                    state.organization = newState.organization;
                }

                if (newState.organizationError) {
                    state.organizationError = newState.organizationError;
                }

                if (state.organizationInfo && newState.organizationInfo) {
                    state.organizationInfo = deepMerge(state.organizationInfo, newState.organizationInfo) as Organization;
                }
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

                const canceler = new Canceler();
                commit('initialize');

                try {
                    if (rootState.auth.authenticated) {
                        self.previousRequests.cancelAll();
                        self.previousRequests.add(canceler);

                        const resUser = await self.client.request({url: '/user'}, canceler);

                        if (resUser) {
                            commit('initializeSuccess', {
                                user: {
                                    id: resUser.id,
                                    username: resUser.username,
                                    email: resUser.email,
                                    firstName: resUser.first_name,
                                    lastName: resUser.last_name,
                                    fullName: resUser.full_name,
                                    initial: resUser.initial as string,
                                    imageUrl: resUser.image_url,
                                    securityIdentities: resUser['@identities'],
                                } as User,
                                organization: state.organization,
                            } as InitSuccess);
                            self.storage.setItem('organization:last', state.organization);

                            dispatch('refreshOrganizationInfo').then();
                        } else {
                            await dispatch('auth/logout', undefined, {root: true});
                            commit('initializeError');
                        }
                    } else {
                        commit('initializeError');
                    }
                } catch (error: any) {
                    if (404 !== error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
                        await dispatch('auth/logout', undefined, {root: true});
                    }

                    commit('initializeError', 404 === error.statusCode);
                }

                self.previousRequests.remove(canceler);
            },

            async refreshUser({commit, state, rootState}): Promise<void> {
                const previousImageUrl = state.user ? state.user.imageUrl : undefined;
                const canceler = new Canceler();
                commit('refreshUser');

                try {
                    if (rootState.auth.authenticated) {
                        self.previousRequests.cancelAll();
                        self.previousRequests.add(canceler);

                        const resUser = await self.client.request({url: '/user'}, canceler);

                        if (resUser) {
                            commit('refreshUserSuccess', {
                                id: resUser.id,
                                username: resUser.username,
                                email: resUser.email,
                                firstName: resUser.first_name,
                                lastName: resUser.last_name,
                                fullName: resUser.full_name,
                                initial: resUser.initial as string,
                                imageUrl: resUser.image_url,
                                securityIdentities: resUser['@identities'],
                            } as User);
                        } else {
                            commit('refreshUserError', previousImageUrl);
                        }
                    } else {
                        commit('refreshUserError', previousImageUrl);
                    }
                } catch (e) {
                    commit('refreshUserError', previousImageUrl);
                }

                self.previousRequests.remove(canceler);
            },

            async setOrganization({commit, state, dispatch}, organization: string): Promise<void> {
                self.storage.setItem('organization:last', organization);
                commit('updateOrganization', organization);
                dispatch('refreshOrganizationInfo').then();
            },

            async refreshOrganizationInfo({commit, state, rootState}, force: boolean = false): Promise<void> {
                if (!rootState.auth.authenticated || !state.initialized) {
                    return;
                }

                if ('user' === state.organization) {
                    commit('updateOrganizationInfoSuccess', undefined);

                    return;
                }

                if (!force && !!state.organizationInfo && state.organization === state.organizationInfo.name) {
                    return;
                }

                let error = false;
                const canceler = self.previousRequests.add(new Canceler());
                const previousImageUrl = !!state.organizationInfo
                    ? state.organizationInfo.imageUrl
                    : undefined;

                try {
                    commit('updateOrganizationInfo');

                    const resOrg = await self.client.request({
                        url: '/' + state.organization + '/organization',
                        fields: ['id', 'name', 'label', 'image_url', '@user_identities'],
                    }, canceler);

                    if (resOrg) {
                        commit('updateOrganizationInfoSuccess', {
                            id: resOrg.id,
                            name: resOrg.name,
                            label: resOrg.label,
                            imageUrl: resOrg.image_url,
                            securityIdentities: resOrg['@user_identities'],
                        } as Organization);
                    } else {
                        commit('updateOrganizationInfoError', previousImageUrl);
                        error = true;
                    }
                } catch (e) {
                    commit('updateOrganizationInfoError', previousImageUrl);
                    error = true;
                }

                if (error) {
                    commit('updateOrganizationInfoSuccess', undefined);
                }

                self.previousRequests.remove(canceler);
            },

            async reset({commit}): Promise<void> {
                self.previousRequests.cancelAll();
                self.storage.removeItem('organization:last');
                commit('reset');
            },
        };
    }
}
