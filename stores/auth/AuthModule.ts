/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AuthCredentials} from '@klipper/bow/auth/AuthCredentials';
import {AuthManager} from '@klipper/bow/auth/AuthManager';
import {AuthToken} from '@klipper/bow/auth/AuthToken';
import {AuthModuleState} from '@klipper/bow/stores/auth/AuthModuleState';
import {AuthState} from '@klipper/bow/stores/auth/AuthState';
import {I18nModuleState} from '@klipper/bow/stores/i18n/I18nModuleState';
import {cleanRedirect} from '@klipper/bow/utils/url';
import Router from 'vue-router';
import {ActionTree, GetterTree, Module, MutationTree} from 'vuex';

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
            refreshPending: false,
            logoutPending : false,
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
                return state.authenticationPending && !state.refreshPending;
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
            isValid(state: AuthState): boolean {
                if (null === state.tokenType || null === state.accessToken || null === state.createdAt) {
                    return false;
                }

                if (null === state.expiresIn) {
                    return true;
                }

                const current = new Date();
                const expiresDate = new Date(state.createdAt);
                expiresDate.setSeconds(expiresDate.getSeconds() + state.expiresIn);

                return expiresDate.getTime() >= current.getTime();
            },
        };
    }

    public get mutations(): MutationTree<AuthState> {
        const self = this;

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
            loginSuccess(state: AuthState, token: AuthToken): void {
                state.authenticated = true;
                state.authenticationPending = false;
                state.tokenType = token.type;
                state.createdAt = token.createdAt;
                state.expiresIn = token.expiresIn;
                state.accessToken = token.accessToken;
                state.refreshToken = token.refreshToken;
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
                state.logoutPending = true;
            },
            logoutFinish(state: AuthState): void {
                state.authenticated = false;
                state.authenticationPending = false;
                state.logoutPending = false;
                state.tokenType = null;
                state.createdAt = null;
                state.expiresIn = null;
                state.accessToken = null;
                state.refreshToken = null;
            },
            cancel(state: AuthState): void {
                state.authenticationPending = false;
            },
            refresh(state: AuthState): void {
                state.refreshPending = true;
            },
            refreshSuccess(state: AuthState, token: AuthToken): void {
                state.authenticated = true;
                state.authenticationPending = false;
                state.refreshPending = false;
                state.tokenType = token.type;
                state.createdAt = token.createdAt;
                state.expiresIn = token.expiresIn;
                state.accessToken = token.accessToken;
                state.refreshToken = token.refreshToken;
            },
            refreshError(state: AuthState): void {
                state.refreshPending = false;
            },
            cancelRefresh(state: AuthState): void {
                state.refreshPending = false;
            },
            syncState(state: AuthState, newState: AuthState): void {
                state.tokenType = newState.tokenType || state.tokenType;
                state.createdAt = newState.createdAt || state.createdAt;
                state.expiresIn = newState.expiresIn || state.expiresIn;
                state.accessToken = newState.accessToken || state.accessToken;
                state.refreshToken = newState.refreshToken || state.refreshToken;

                if (newState.logoutPending) {
                    state.authenticated = false;
                    state.authenticationPending = false;
                    state.logoutPending = false;
                    state.tokenType = null;
                    state.createdAt = null;
                    state.expiresIn = null;
                    state.accessToken = null;
                    state.refreshToken = null;

                    self.router.replace({
                        name: 'login',
                        query: {redirect: cleanRedirect(self.router.currentRoute.fullPath)},
                    }).then(() => {});
                }
            },
        };
    }

    public get actions(): ActionTree<AuthState, R> {
        const self = this;

        return {
            async login({commit, state, rootState}, credentials: AuthCredentials): Promise<void> {
                commit('cancelRefresh');
                commit('login');

                try {
                    const redirect = self.router.currentRoute.query.redirect;
                    const res = await self.authManager.login(credentials);

                    self.storage.setItem('auth:token', JSON.stringify(res));
                    commit('loginSuccess', res);

                    if (redirect) {
                        await self.router.replace(redirect as string);
                    } else {
                        await self.router.replace({path: '/', params: {locale: rootState.i18n.locale}});
                    }
                } catch (e) {
                    if (null !== state.accessToken) {
                        self.authManager.logout(state.accessToken).then().catch();
                    }

                    commit('loginError');
                    throw e;
                }
            },

            async logout({commit, state, rootState}, pingServer: boolean = true): Promise<void> {
                if (state.refreshPending) {
                    return;
                }

                commit('logout');

                if (null !== state.accessToken && pingServer) {
                    self.authManager.logout(state.accessToken).then().catch();
                }

                self.storage.removeItem('auth:token');
                commit('logoutFinish');

                await self.router.replace({
                    name: 'login', params: {locale: rootState.i18n.locale},
                    query: {redirect: cleanRedirect(self.router.currentRoute.fullPath)},
                });
            },

            async cancel({commit}): Promise<void> {
                try {
                    await self.authManager.cancel();
                } catch (e) {}

                commit('cancel');
            },

            async refresh({commit, getters, dispatch}, silent: boolean = false): Promise<void> {
                commit('cancel');

                if (!silent) {
                    commit('refresh');
                }

                const token = getters.getToken as AuthToken|null;

                if (null === token || null === token.refreshToken) {
                    commit('refreshError');
                    await dispatch('logout');

                    throw new Error('Refresh token is not available');
                }

                try {
                    const res = await self.authManager.refresh(token.refreshToken);

                    self.storage.setItem('auth:token', JSON.stringify(res));
                    commit('refreshSuccess', res);
                } catch (e) {
                    commit('refreshError');

                    if ([400, 401].includes(e.statusCode)) {
                        await dispatch('logout', false);
                        return;
                    }

                    throw e;
                }
            },

            async cancelRefresh({commit}): Promise<void> {
                try {
                    await self.authManager.cancel();
                } catch (e) {}

                commit('cancelRefresh');
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
                        createdAt: json.createdAt,
                        expiresIn: json.expiresIn,
                        accessToken: json.accessToken,
                        refreshToken: json.refreshToken,
                    };
                }
            } catch (e) {}
        }

        return null;
    }
}
