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
import {AuthToken} from '../../auth/AuthToken';
import {I18nModuleState} from '../i18n/I18nModuleState';
import {AuthModuleState} from './AuthModuleState';
import {AuthState} from './AuthState';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class AuthModule<R extends AuthModuleState&I18nModuleState> implements Module<AuthState, R> {
    private readonly router: Router;

    private readonly authManager: AuthManager;

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
        const auth = this.getToken();

        return {
            authenticated: !!auth,
            authenticationPending: false,
            tokenType: auth ? auth.type : null,
            createdAt: auth ? auth.createdAt : null,
            expiresIn: auth ? auth.expiresIn : null,
            accessToken: auth ? auth.accessToken : null,
            refreshToken: auth ? auth.refreshToken : null,
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
            getToken(state: AuthState): AuthToken|null {
                if (state.tokenType && state.createdAt && state.accessToken) {
                    return {
                        type: state.tokenType,
                        createdAt: state.createdAt,
                        expiresIn: state.expiresIn,
                        accessToken: state.accessToken,
                        refreshToken: state.refreshToken,
                    } as AuthToken;
                }

                return null;
            },
        };
    }

    public get mutations(): MutationTree<AuthState> {
        return {
            login(state: AuthState): void {
                state.authenticated = false;
                state.authenticationPending = true;
                state.tokenType = null;
                state.createdAt = null;
                state.expiresIn = null;
                state.accessToken = null;
                state.refreshToken = null;
            },
            loginSuccess(state: AuthState): void {
                state.authenticated = true;
                state.authenticationPending = false;
            },
            loginError(state: AuthState): void {
                state.authenticated = false;
                state.authenticationPending = false;
                state.tokenType = null;
                state.createdAt = null;
                state.expiresIn = null;
                state.accessToken = null;
                state.refreshToken = null;
            },
            logout(state: AuthState): void {
                state.authenticated = false;
                state.authenticationPending = false;
                state.tokenType = null;
                state.createdAt = null;
                state.expiresIn = null;
                state.accessToken = null;
                state.refreshToken = null;
            },
            cancel(state: AuthState): void {
                state.authenticationPending = false;
            },
        };
    }

    public get actions(): ActionTree<AuthState, R> {
        const self = this;

        return {
            async login({commit, state, rootState}, credentials: AuthCredentials): Promise<void> {
                commit('login');

                try {
                    const redirect = self.router.currentRoute.query.redirect;
                    const res = await self.authManager.login(credentials);

                    state.tokenType = res.type;
                    state.createdAt = res.createdAt;
                    state.expiresIn = res.expiresIn;
                    state.accessToken = res.accessToken;
                    state.refreshToken = res.refreshToken;
                    self.storage.setItem('auth:token', JSON.stringify(res));
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
                try {
                    await self.authManager.logout(state.accessToken);
                } catch (e) {}

                self.storage.removeItem('auth:token');
                commit('logout');
                await self.router.replace({
                    name: 'login', params: {locale: rootState.i18n.locale},
                    query: {redirect: self.router.currentRoute.fullPath},
                });
            },

            async cancel({commit}): Promise<void> {
                try {
                    await self.authManager.cancel();
                } catch (e) {}

                commit('cancel');
            },
        };
    }

    protected getToken(): AuthToken|null {
        const res = this.storage.getItem('auth:token');

        if (!!res) {
            try {
                const json = JSON.parse(res);

                if (json.type && json.createdAt && json.expiresIn && json.accessToken && json.refreshToken) {
                    return {
                        type: json.type,
                        createdAt: new Date(json.createdAt),
                        expiresIn: json.expiresIn,
                        accessToken: json.accessToken,
                        refreshToken: json.accessToken,
                    };
                }
            } catch (e) {}
        }

        return null;
    }
}
