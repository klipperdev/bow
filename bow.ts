/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import 'core-js/stable';
import './propertyDecorator/registerHooks';
import Vue from 'vue';
import Meta from 'vue-meta';
import VueI18n from 'vue-i18n';
import Vuex, {Store, StoreOptions} from 'vuex';
import Vuetify from 'vuetify/lib';
import VueLongClick from './longClick/VueLongClick';
import VueRouterBack from './routerBack/VueRouterBack';
import VueSnackbar from './snackbar/VueSnackbar';
import VueFormatter from './formatter/VueFormatter';
import VueI18nExtra from './i18n/VueI18nExtra';
import VueValidator from './validator/VueValidator';
import VueThemer from './themer/VueThemer';
import VueApi from './api/VueApi';
import Router, {RouterOptions, RedirectOption} from 'vue-router';
import KSimpleSpacer from './components/KSimpleSpacer/KSimpleSpacer.vue';
import {RouterBackOptions} from './routerBack/RouterBackOptions';
import {RequiredRule} from './validator/rules/RequiredRule';
import {I18nValidator} from './validator/I18nValidator';
import {I18nModule} from './stores/i18n/I18nModule';
import {DarkModeModule} from './stores/darkMode/DarkModeModule';
import {DrawerModule} from './stores/drawer/DrawerModule';
import {AuthModule} from './stores/auth/AuthModule';
import {KlipperAuthManager} from './auth/KlipperAuthManager';
import {CurrencyFormatter} from './i18n/CurrencyFormatter';
import {KlipperClient} from '@klipper/sdk/KlipperClient';
import {KlipperClientConfig} from '@klipper/sdk/KlipperClientConfig';
import {OauthConfig} from '@klipper/sdk/OauthConfig';
import {AccountModule} from './stores/account/AccountModule';
import {AppState} from './stores/AppState';
import {Vuetify as IVuetify} from 'vuetify/types';
import {deepMerge} from './utils/object';
import {createRouterBase, createRoutes} from './routers/router';
import {addAuthGuard, addOrganizationGuard} from './routers/authGuard';
import {addDefaultToolbarComponentGuard} from './routers/defaultToolbarComponentGuard';
import {
    addAuthInterceptor,
    addAuthRedirectInterceptor,
    addLocaleInterceptor,
    addOrganizationInterceptor,
} from './api/apiInterceptors';
import {UserVuetifyPreset} from 'vuetify/types/services/presets';
import bowLocaleEn from './translations/en';
import bowLocaleFr from './translations/fr';
import vuetifyLocaleFr from 'vuetify/src/locale/fr';
import vuetifyBowPreset from './vuetify/bowPreset';
import './registerServiceWorker';

/**
 * Create the app.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function createApp<S extends AppState = AppState>(config?: AppConfig<S>): AppVueConfig<S> {
    Vue.config.productionTip = false;
    Vue.use(Meta);
    Vue.use(VueI18n);
    Vue.use(Vuetify);
    Vue.use(Vuex);
    Vue.use(Router);

    config = config || {};
    const customConfigVuetify = config.vuetifyPreset || {};
    const customConfigI18n = config.i18n || {} as Partial<any>;
    const customConfigRouter = config.router || {};
    const customConfigApiClient = config.apiClient || {};
    let customConfigStore = config.store || {};

    if (typeof customConfigStore !== 'function') {
        customConfigStore = () => {
            return customConfigStore as StoreOptions<S>;
        };
    }

    const vuetify = new Vuetify(deepMerge(vuetifyBowPreset, {
        lang: {
            locales: {
                fr: vuetifyLocaleFr,
            },
        },
    }, customConfigVuetify));

    const i18n = new VueI18n(deepMerge({
        locale: 'en',
        fallbackLocale: 'en',
        messages: {
            en: Object.assign({}, bowLocaleEn),
            fr: Object.assign({}, bowLocaleFr),
        },
    }, customConfigI18n));

    const customRoutes = customConfigRouter.routes || [];
    delete customConfigRouter.routes;
    const router = new Router(deepMerge<RouterOptions>({
        mode: 'history',
        base: createRouterBase(APP_CONFIG.assets.baseUrl, APP_CONFIG.api.baseUrl),
    }, customConfigRouter, {
        routes: createRoutes(customRoutes, config.rootRedirectRoute, config.useStandardLogin || true),
    }));

    const apiClient = new KlipperClient(deepMerge({
        baseUrl: APP_CONFIG.api.baseUrl,
        oauth: {
            baseUrl: APP_CONFIG.api.oauth.baseUrl,
            clientId: APP_CONFIG.api.oauth.clientId,
            scope: APP_CONFIG.api.oauth.scope,
        } as OauthConfig,
    }, customConfigApiClient) as KlipperClientConfig);

    const store = new Vuex.Store<S>(deepMerge<StoreOptions<S>>({
        state: {} as S,
        modules: {
            i18n: new I18nModule(i18n, vuetify),
            darkMode: new DarkModeModule(),
            drawer: new DrawerModule(),
            auth: new AuthModule(router, new KlipperAuthManager(apiClient)),
            account: new AccountModule(apiClient, config.onlyOrganizations || true),
        },
    }, customConfigStore({i18n, router, vuetify})));

    Vue.use(VueLongClick);
    Vue.use(new VueRouterBack(router), {forceHistory: true} as RouterBackOptions);
    Vue.use(new VueI18nExtra({currencyFormatter: new CurrencyFormatter(store)}));
    Vue.use(new VueValidator(new I18nValidator([RequiredRule], i18n)));
    Vue.use(new VueThemer(store));
    Vue.use(new VueSnackbar());
    Vue.use(new VueFormatter());
    Vue.use(new VueApi(apiClient));

    addAuthGuard(router, store);
    addOrganizationGuard(router, store);
    addDefaultToolbarComponentGuard(router, 'toolbar', KSimpleSpacer);
    addLocaleInterceptor(apiClient, store);
    addAuthInterceptor(apiClient, store);
    addAuthRedirectInterceptor(apiClient, store);
    addOrganizationInterceptor(apiClient, store);

    return {
        i18n,
        store,
        router,
        vuetify,
    } as AppVueConfig<S>;
}

export interface AppConfig<S extends AppState> {
    vuetifyPreset?: Partial<UserVuetifyPreset>;
    i18n?: VueI18n.I18nOptions;
    router?: RouterOptions;
    rootRedirectRoute?: RedirectOption;
    useStandardLogin?: boolean;
    apiClient?: KlipperClientConfig;
    store?: StoreOptions<S>|((partialAppConfig: PartialAppVueConfig<S>) => StoreOptions<S>);
    onlyOrganizations?: boolean;
}

export interface PartialAppVueConfig<S extends AppState> extends Partial<any> {
    i18n: VueI18n;
    router: Router;
    vuetify: IVuetify;
}

export interface AppVueConfig<S extends AppState> extends PartialAppVueConfig<S> {
    store: Store<S>;
}
