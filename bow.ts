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
import VueKlipper from './klipper/VueKlipper';
import VueLongClick from './longClick/VueLongClick';
import VueRouterBack from './routerBack/VueRouterBack';
import VueSnackbar from './snackbar/VueSnackbar';
import VueAccount from './account/VueAccount';
import VueI18nExtra from './i18n/VueI18nExtra';
import VueValidator from './validator/VueValidator';
import VueThemer from './themer/VueThemer';
import VueApi from './api/VueApi';
import VueUploader from './uploader/VueUploader';
import VueMetadata from './metadata/VueMetadata';
import VueOptChain from './optchain/VueOptChain';
import Router, {Location, RouterOptions, RedirectOption, RawLocation} from 'vue-router';
import KSimpleSpacer from './components/KSimpleSpacer/KSimpleSpacer.vue';
import {LocaleData} from 'i18n-iso-countries';
import {Klipper} from './klipper/Klipper';
import {RouterBackOptions} from './routerBack/RouterBackOptions';
import {EmailRule} from './validator/rules/EmailRule';
import {RequiredRule} from './validator/rules/RequiredRule';
import {I18nValidator} from './validator/I18nValidator';
import {I18nModule} from './stores/i18n/I18nModule';
import {DarkModeModule} from './stores/darkMode/DarkModeModule';
import {DrawerModule} from './stores/drawer/DrawerModule';
import {AuthModule} from './stores/auth/AuthModule';
import {KlipperAuthManager} from './auth/KlipperAuthManager';
import {NumberFormatter} from './i18n/NumberFormatter';
import {DateFormatter} from './i18n/DateFormatter';
import {CountryFormatter} from './i18n/CountryFormatter';
import {Uploader} from './uploader/Uploader';
import {KlipperClient} from '@klipper/sdk/KlipperClient';
import {KlipperClientConfig} from '@klipper/sdk/KlipperClientConfig';
import {OauthConfig} from '@klipper/sdk/OauthConfig';
import {AccountModule} from './stores/account/AccountModule';
import {MetadataModule} from './stores/metadata/MetadataModule';
import {UploaderOptions} from './uploader/UploaderOptions';
import {AppState} from './stores/AppState';
import {Vuetify as IVuetify} from 'vuetify/types';
import {deepMerge} from './utils/object';
import {createRouterBase, createRoutes} from './routers/router';
import {addAuthGuard, addPreAuthGuard} from './routers/authGuard';
import {addOrganizationGuard} from './routers/organizationGuard';
import {addDefaultToolbarComponentGuard} from './routers/defaultToolbarComponentGuard';
import {
    addAuthInterceptor,
    addAuthRedirectInterceptor,
    addLocaleInterceptor,
    addOrganizationInterceptor,
} from './api/apiInterceptors';
import {UserVuetifyPreset} from 'vuetify/types/services/presets';
import defaultAppBadge from './assets/img/appBadge.svg';
import bowLocaleEn from './translations/en';
import bowLocaleFr from './translations/fr';
import vuetifyLocaleFr from 'vuetify/src/locale/fr';
import vuetifyBowPreset from './vuetify/bowPreset';
import uploaderFr from '@uppy/locales/src/fr_FR';
import countryFr from 'i18n-iso-countries/langs/fr.json';
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

    const klipper = new Klipper(
        APP_CONFIG.name,
        config.appBadgeLight || defaultAppBadge,
        config.appBadgeDark || defaultAppBadge,
        !!config.allowUserContext,
        config.userContextRedirectRoute,
    );

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
        routes: createRoutes(
            customRoutes,
            config.rootRedirectRoute,
            config.useStandardLogin || true,
            config.useOrganizationRoute || true,
            config.useUserSettingsRoute || true,
        ),
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
            metadata: new MetadataModule(apiClient),
        },
    }, customConfigStore({i18n, router, vuetify})));

    const uploader = new Uploader(store, deepMerge({
        locales: {
            fr: uploaderFr,
        },
    }, config.uploader || {} as Partial<any>));

    const countryFormatterLocales = config.i18nExtra && config.i18nExtra.countryFormatter
        ? config.i18nExtra.countryFormatter.locales
        : {};

    Vue.use(VueLongClick);
    Vue.use(new VueKlipper(klipper));
    Vue.use(new VueRouterBack(router), {forceHistory: true, rootRoute: config.rootRoute} as RouterBackOptions);
    Vue.use(new VueI18nExtra({
        dateFormatter: new DateFormatter(i18n),
        numberFormatter: new NumberFormatter(i18n),
        countryFormatter: new CountryFormatter(Object.values(Object.assign({}, {
            fr: countryFr,
        }, countryFormatterLocales)) as LocaleData[], i18n),
    }));
    Vue.use(new VueValidator(new I18nValidator([
        EmailRule,
        RequiredRule,
    ], i18n)));
    Vue.use(new VueThemer(store));
    Vue.use(new VueSnackbar());
    Vue.use(new VueAccount(store));
    Vue.use(new VueApi(apiClient));
    Vue.use(new VueUploader(uploader));
    Vue.use(new VueMetadata(store));
    Vue.use(new VueOptChain());

    addPreAuthGuard(router);
    addOrganizationGuard(router, store);
    addAuthGuard(router, store);
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
    appBadgeLight?: any;
    appBadgeDark?: any;
    allowUserContext?: boolean;
    vuetifyPreset?: Partial<UserVuetifyPreset>;
    i18n?: VueI18n.I18nOptions;
    i18nExtra?: AppI18nExtraConfig;
    router?: RouterOptions;
    rootRedirectRoute?: RedirectOption;
    rootRoute?: RawLocation;
    userContextRedirectRoute?: Location;
    useStandardLogin?: boolean;
    useOrganizationRoute?: boolean;
    useUserSettingsRoute?: boolean;
    apiClient?: KlipperClientConfig;
    store?: StoreOptions<S>|((partialAppConfig: PartialAppVueConfig) => StoreOptions<S>);
    onlyOrganizations?: boolean;
    uploader?: UploaderOptions;
}

export interface PartialAppVueConfig extends Partial<any> {
    i18n: VueI18n;
    router: Router;
    vuetify: IVuetify;
}

export interface AppVueConfig<S extends AppState> extends PartialAppVueConfig {
    store: Store<S>;
}

export interface AppI18nExtraConfig {
    countryFormatter?: CountryFormatterConfig;
}

export interface CountryFormatterConfig {
    locales: Partial<LocaleData>;
}
