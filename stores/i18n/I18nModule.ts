/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import moment from 'moment';
import VueI18n from 'vue-i18n';
import {ActionTree, GetterTree, Module, MutationTree} from 'vuex';
import {Vuetify} from 'vuetify/types';
import {AvailableLocale} from '@klipper/bow/i18n/AvailableLocale';
import {AccountModuleState} from '@klipper/bow/stores/account/AccountModuleState';
import {AuthModuleState} from '@klipper/bow/stores/auth/AuthModuleState';
import {I18nModuleState} from '@klipper/bow/stores/i18n/I18nModuleState';
import {I18nState} from '@klipper/bow/stores/i18n/I18nState';
import {InitSuccess} from '@klipper/bow/stores/i18n/InitSuccess';
import {AvailableLocaleResponse} from '@klipper/sdk/models/responses/intl/AvailableLocaleResponse';
import {AvailableLocales} from '@klipper/bow/i18n/AvailableLocales';
import {CancelerBag} from '@klipper/http-client/CancelerBag';
import {Canceler} from '@klipper/http-client/Canceler';
import {KlipperClient} from '@klipper/sdk/KlipperClient';
import {Intl} from '@klipper/sdk/services/Intl';
import {deepMerge} from '@klipper/bow/utils/object';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class I18nModule<R extends I18nModuleState&AccountModuleState&AuthModuleState> implements Module<I18nState, R> {

    private static convertAvailableLocaleResponses(responseAvailableLocales: AvailableLocaleResponse[]): AvailableLocales {
        const res = {} as AvailableLocales;

        for (const resLocale of responseAvailableLocales) {
            res[resLocale.code] = {
                code: resLocale.code,
                name: resLocale.name,
            } as AvailableLocale;
        }

        return res;
    }

    private readonly i18n: VueI18n;

    private readonly client: KlipperClient;

    private readonly vuetify?: Vuetify;

    private readonly storage: Storage;

    private previousRequests: CancelerBag = new CancelerBag();

    /**
     * Constructor.
     */
    public constructor(i18n: VueI18n, client: KlipperClient, vuetify?: Vuetify, storage?: Storage) {
        this.i18n = i18n;
        this.client = client;
        this.vuetify = vuetify;
        this.storage = storage ? storage : localStorage;
    }

    public get namespaced(): boolean {
        return true;
    }

    public get state(): I18nState {
        return {
            initialized: false,
            initializationPending: false,
            availableLocales: {},
            locale: this.findLocale(),
            fallback: this.i18n.fallbackLocale as string,
        };
    }

    public get getters(): GetterTree<I18nState, R> {
        return {
            getLocale(state: I18nState): string {
                return state.locale;
            },
            getLocaleFallback(state: I18nState): string {
                return state.fallback;
            },
        };
    }

    public get mutations(): MutationTree<I18nState> {
        const self = this;

        return {
            initialize(state: I18nState): void {
                state.initialized = false;
                state.initializationPending = true;
            },

            initializeSuccess(state: I18nState, payload: InitSuccess): void {
                state.initialized = true;
                state.initializationPending = false;
                const newValue = {};
                deepMerge<AvailableLocale>(newValue, payload.availableLocales);
                state.availableLocales = newValue;
            },

            initializeError(state: I18nState): void {
                state.initialized = true;
                state.initializationPending = false;
            },

            reset(state: I18nState): void {
                state.initialized = false;
                state.initializationPending = false;
                state.availableLocales = {};
            },

            setLocale(state: I18nState, locale: string): void {
                const oldLocale = state.locale;
                locale = self.getAvailableLocale(locale) || self.i18n.locale;

                if (oldLocale === locale) {
                    return;
                }

                self.saveLocale(locale);
                state.locale = locale;
            },
        };
    }

    public get actions(): ActionTree<I18nState, R> {
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

                        const resAvailableLocales = await self.client.get<Intl>(Intl).all(rootState.account.organization);

                        if (resAvailableLocales) {
                            commit('initializeSuccess', {
                                availableLocales: I18nModule.convertAvailableLocaleResponses(resAvailableLocales.results),
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

    /**
     * Find locale.
     *
     * @return {string}
     */
    private findLocale(): string {
        let locale = this.storage.getItem('i18n:locale');

        if (null === locale && window.navigator) {
            const availables: any = window.navigator.languages;

            for (const available of availables) {
                const availableLocale = this.getAvailableLocale(available);

                if (availableLocale) {
                    locale = availableLocale;
                    break;
                }
            }
        }

        return this.saveLocale(locale || this.i18n.locale);
    }

    /**
     * Get the available locale.
     *
     * @param {string|null} locale
     *
     * @return {string|null}
     */
    private getAvailableLocale(locale: string | null): string | null {
        if (locale) {
            if (this.i18n.messages[locale]) {
                return locale;
            } else if (locale.indexOf('-') > 0) {
                locale = locale.substring(0, locale.indexOf('-'));

                if (this.i18n.messages[locale]) {
                    return locale;
                }
            }
        }

        return null;
    }

    /**
     * Save and inject the locale.
     *
     * @param {string} locale
     *
     * @return {string}
     */
    private saveLocale(locale: string): string {
        this.storage.setItem('i18n:locale', locale);
        this.i18n.locale = locale;
        moment.locale(locale);

        if (undefined !== this.vuetify) {
            this.vuetify.framework.lang.current = locale;
        }

        return locale;
    }
}
