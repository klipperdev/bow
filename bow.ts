/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import 'core-js/stable';
import '@klipper/bow/propertyDecorator/registerHooks';
import Vue from 'vue';
import Meta from 'vue-meta';
import VueI18n from 'vue-i18n';
import Vuex, {Store, StoreOptions} from 'vuex';
import Vuetify from 'vuetify/lib';
import VueKlipper from '@klipper/bow/klipper/VueKlipper';
import VueLongClick from '@klipper/bow/longClick/VueLongClick';
import VueRouterBack from '@klipper/bow/routerBack/VueRouterBack';
import VueSnackbar from '@klipper/bow/snackbar/VueSnackbar';
import VueAccount from '@klipper/bow/account/VueAccount';
import VueI18nExtra from '@klipper/bow/i18n/VueI18nExtra';
import VueValidator from '@klipper/bow/validator/VueValidator';
import VueThemer from '@klipper/bow/themer/VueThemer';
import VueApi from '@klipper/bow/api/VueApi';
import VueUploader from '@klipper/bow/uploader/VueUploader';
import VueMetadata from '@klipper/bow/metadata/VueMetadata';
import VueOptChain from '@klipper/bow/optchain/VueOptChain';
import Router, {Location, RouterOptions, RedirectOption, RawLocation} from 'vue-router';
import KSimpleSpacer from '@klipper/bow/components/KSimpleSpacer/KSimpleSpacer.vue';
import {LocaleData} from 'i18n-iso-countries';
import {Klipper} from '@klipper/bow/klipper/Klipper';
import {RouterBackOptions} from '@klipper/bow/routerBack/RouterBackOptions';
import {EmailRule} from '@klipper/bow/validator/rules/EmailRule';
import {JsonRule} from '@klipper/bow/validator/rules/JsonRule';
import {RequiredRule} from '@klipper/bow/validator/rules/RequiredRule';
import {I18nValidator} from '@klipper/bow/validator/I18nValidator';
import {I18nModule} from '@klipper/bow/stores/i18n/I18nModule';
import {DarkModeModule} from '@klipper/bow/stores/darkMode/DarkModeModule';
import {DrawerModule} from '@klipper/bow/stores/drawer/DrawerModule';
import {AuthModule} from '@klipper/bow/stores/auth/AuthModule';
import {KlipperAuthManager} from '@klipper/bow/auth/KlipperAuthManager';
import {NumberFormatter} from '@klipper/bow/i18n/NumberFormatter';
import {DateFormatter} from '@klipper/bow/i18n/DateFormatter';
import {CountryFormatter} from '@klipper/bow/i18n/CountryFormatter';
import {LocaleFormatter} from '@klipper/bow/i18n/LocaleFormatter';
import {Uploader} from '@klipper/bow/uploader/Uploader';
import {KlipperClient} from '@klipper/sdk/KlipperClient';
import {KlipperClientConfig} from '@klipper/sdk/KlipperClientConfig';
import {OauthConfig} from '@klipper/sdk/OauthConfig';
import {AccountModule} from '@klipper/bow/stores/account/AccountModule';
import {MetadataModule} from '@klipper/bow/stores/metadata/MetadataModule';
import {UploaderOptions} from '@klipper/bow/uploader/UploaderOptions';
import {AppState} from '@klipper/bow/stores/AppState';
import {Vuetify as IVuetify} from 'vuetify/types';
import {deepMerge} from '@klipper/bow/utils/object';
import {createRouterBase, createRoutes} from '@klipper/bow/routers/router';
import {addAuthGuard, addPreAuthGuard} from '@klipper/bow/routers/authGuard';
import {addOrganizationGuard} from '@klipper/bow/routers/organizationGuard';
import {addDefaultToolbarComponentGuard} from '@klipper/bow/routers/defaultToolbarComponentGuard';
import {
    addAuthInterceptor,
    addAuthRedirectInterceptor,
    addLocaleInterceptor,
    addOrganizationInterceptor,
} from '@klipper/bow/api/apiInterceptors';
import {UserVuetifyPreset} from 'vuetify/types/services/presets';
import defaultAppBadge from '@klipper/bow/assets/img/appBadge.svg';
import bowLocaleEn from '@klipper/bow/translations/en';
import bowLocaleFr from '@klipper/bow/translations/fr';
import vuetifyLocaleFr from 'vuetify/src/locale/fr';
import vuetifyBowPreset from '@klipper/bow/vuetify/bowPreset';
import uploaderFr from '@uppy/locales/src/fr_FR';
import countryFr from 'i18n-iso-countries/langs/fr.json';
import '@klipper/bow/registerServiceWorker';

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
        scrollBehavior: (to, from, savedPosition) => {
            const value = savedPosition
                ? savedPosition
                : {x: 0, y: 0};

            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(value);
                }, 230);
            });
        },
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
            i18n: new I18nModule(i18n, apiClient, vuetify),
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
        localeFormatter: new LocaleFormatter(),
    }));
    Vue.use(new VueValidator(new I18nValidator([
        EmailRule,
        JsonRule,
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
