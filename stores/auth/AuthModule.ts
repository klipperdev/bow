/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Router from 'vue-router';
import {ActionTree, GetterTree, Module, MutationTree} from 'vuex';
import {AuthManager} from '../../auth/AuthManager';
import {AuthCredentials} from '../../auth/AuthCredentials';
import {I18nModuleState} from '../i18n/I18nModuleState';
import {AuthState} from './AuthState';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class AuthModule<R extends I18nModuleState, C extends object> implements Module<AuthState, R> {
    private readonly router: Router;

    private readonly authManager: AuthManager<C>;

    private readonly storage: Storage;

    /**
     * Constructor.
     *
     * @param router      The router
     * @param authManager The auth manager
     * @param storage     The storage
     */
    public constructor(router: Router, authManager: AuthManager, storage?: Storage) {
        this.router = router;
        this.authManager = authManager;
        this.storage = storage ? storage : localStorage;
    }

    public get namespaced(): boolean {
        return true;
    }

    public get state(): AuthState {
        return {
            authenticated: !!this.storage.getItem('auth:token'),
            authenticationPending: false,
            token: this.storage.getItem('auth:token'),
        };
    }

    public get getters(): GetterTree<AuthState, R> {
        return {
            isAuthenticationPending(state: AuthState): boolean {
                return state.authenticationPending;
            },
            isAuthenticated(state: AuthState): boolean {
                return state.authenticated;
            },
        };
    }

    public get mutations(): MutationTree<AuthState> {
        return {
            login(state: AuthState): void {
                state.authenticationPending = true;
            },
            loginSuccess(state: AuthState): void {
                state.authenticated = true;
                state.authenticationPending = false;
            },
            loginError(state: AuthState): void {
                state.authenticated = false;
                state.authenticationPending = false;
            },
            logout(state: AuthState): void {
                state.authenticated = false;
            },
        };
    }

    public get actions(): ActionTree<AuthState, R> {
        const self = this;

        return {
            async login({commit, state, rootState}, credentials: AuthCredentials<C>): Promise<void> {
                commit('login');

                try {
                    const redirect = self.router.currentRoute.query.redirect;
                    const res = await self.authManager.login(credentials);

                    state.token = res.token;

                    if (null === state.token) {
                        self.storage.removeItem('auth:token');
                    } else {
                        self.storage.setItem('auth:token', state.token);
                    }

                    commit('loginSuccess');

                    if (redirect) {
                        await self.router.replace(redirect as string);
                    } else {
                        await self.router.replace({name: 'home', params: {locale: rootState.i18n.locale}});
                    }
                } catch (e) {
                    commit('loginError');
                    throw e;
                }
            },
            async logout({commit, state, rootState}): Promise<void> {
                await self.authManager.logout(state);
                state.token = null;
                self.storage.removeItem('auth:token');
                commit('logout');
                await self.router.replace({
                    name: 'login', params: {locale: rootState.i18n.locale},
                    query: {redirect: self.router.currentRoute.fullPath},
                });
            },

            async cancel(): Promise<void> {
                self.authManager.cancel();
            },
        };
    }
}
