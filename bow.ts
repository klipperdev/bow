/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import VueAccount from '@klipper/bow/account/VueAccount';
import {
    addAuthInterceptor,
    addAuthRedirectInterceptor,
    addLocaleInterceptor,
    addOrganizationInterceptor,
    addTimezoneInterceptor,
} from '@klipper/bow/api/apiInterceptors';
import VueApi from '@klipper/bow/api/VueApi';
import defaultAppBadge from '@klipper/bow/assets/img/appBadge.svg';
import {KlipperAuthManager} from '@klipper/bow/auth/KlipperAuthManager';
import KSimpleSpacer from '@klipper/bow/components/KSimpleSpacer/KSimpleSpacer.vue';
import {AssociationDataModelTransformer} from '@klipper/bow/dataTransformer/dataModelTransformer/AssociationDataModelTransformer';
import {FieldEntityChoiceDataModelTransformer} from '@klipper/bow/dataTransformer/dataModelTransformer/FieldEntityChoiceDataModelTransformer';
import {ReadOnlyDataModelTransformer} from '@klipper/bow/dataTransformer/dataModelTransformer/ReadOnlyDataModelTransformer';
import {DataTransformer} from '@klipper/bow/dataTransformer/DataTransformer';
import VueDataTransformer from '@klipper/bow/dataTransformer/VueDataTransformer';
import {DrawerContextItems} from '@klipper/bow/drawer/DrawerContextItems';
import {DrawerOptions} from '@klipper/bow/drawer/DrawerOptions';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {CountryFormatter} from '@klipper/bow/i18n/CountryFormatter';
import {DateFormatter} from '@klipper/bow/i18n/DateFormatter';
import {LocaleFormatter} from '@klipper/bow/i18n/LocaleFormatter';
import {NumberFormatter} from '@klipper/bow/i18n/NumberFormatter';
import VueI18nExtra from '@klipper/bow/i18n/VueI18nExtra';
import {Klipper} from '@klipper/bow/klipper/Klipper';
import VueKlipper from '@klipper/bow/klipper/VueKlipper';
import VueLongClick from '@klipper/bow/longClick/VueLongClick';
import VueMetadata from '@klipper/bow/metadata/VueMetadata';
import VueOptionChain from '@klipper/bow/optionChain/VueOptionChain';
import '@klipper/bow/propertyDecorator/registerHooks';
import '@klipper/bow/registerServiceWorker';
import {RouterBackOptions} from '@klipper/bow/routerBack/RouterBackOptions';
import VueRouterBack from '@klipper/bow/routerBack/VueRouterBack';
import VueRouterQuery from '@klipper/bow/routerQuery/VueRouterQuery';
import {addAuthGuard, addPreAuthGuard} from '@klipper/bow/routers/authGuard';
import {addDefaultToolbarComponentGuard} from '@klipper/bow/routers/defaultToolbarComponentGuard';
import {addDrawerContextGuard} from '@klipper/bow/routers/drawerGuard';
import {addOrganizationGuard} from '@klipper/bow/routers/organizationGuard';
import {addRootRedirectGuard} from '@klipper/bow/routers/rootRedirectGuard';
import {createRoutes} from '@klipper/bow/routers/routes';
import VueSlotWrapper from '@klipper/bow/slot/VueSlotWrapper';
import VueSnackbar from '@klipper/bow/snackbar/VueSnackbar';
import {AccountModule} from '@klipper/bow/stores/account/AccountModule';
import {AppState} from '@klipper/bow/stores/AppState';
import {AuthModule} from '@klipper/bow/stores/auth/AuthModule';
import {DarkModeModule} from '@klipper/bow/stores/darkMode/DarkModeModule';
import {DrawerModule} from '@klipper/bow/stores/drawer/DrawerModule';
import {I18nModule} from '@klipper/bow/stores/i18n/I18nModule';
import {MetadataModule} from '@klipper/bow/stores/metadata/MetadataModule';
import createSyncState from '@klipper/bow/stores/syncState/vuexSyncState';
import VueThemer from '@klipper/bow/themer/VueThemer';
import bowLocaleEn from '@klipper/bow/translations/en';
import bowLocaleEs from '@klipper/bow/translations/es';
import bowLocaleFr from '@klipper/bow/translations/fr';
import {Uploader} from '@klipper/bow/uploader/Uploader';
import {UploaderOptions} from '@klipper/bow/uploader/UploaderOptions';
import VueUploader from '@klipper/bow/uploader/VueUploader';
import {deepMerge} from '@klipper/bow/utils/object';
import {createRouterBase} from '@klipper/bow/utils/router';
import {I18nValidator} from '@klipper/bow/validator/I18nValidator';
import {EmailRule} from '@klipper/bow/validator/rules/EmailRule';
import {JsonRule} from '@klipper/bow/validator/rules/JsonRule';
import {LengthRule} from '@klipper/bow/validator/rules/LengthRule';
import {NumberRule} from '@klipper/bow/validator/rules/NumberRule';
import {RangeRule} from '@klipper/bow/validator/rules/RangeRule';
import {RequiredRule} from '@klipper/bow/validator/rules/RequiredRule';
import {UrlRule} from '@klipper/bow/validator/rules/UrlRule';
import VueValidator from '@klipper/bow/validator/VueValidator';
import vuetifyBowPreset from '@klipper/bow/vuetify/bowPreset';
import {KlipperClient} from '@klipper/sdk/KlipperClient';
import {KlipperClientConfig} from '@klipper/sdk/KlipperClientConfig';
import {OauthConfig} from '@klipper/sdk/OauthConfig';
import uploaderFr from '@uppy/locales/src/fr_FR';
import 'core-js/stable';
import {LocaleData} from 'i18n-iso-countries';
import countryFr from 'i18n-iso-countries/langs/fr.json';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import Meta from 'vue-meta';
import Router, {Location, RawLocation, RedirectOption, RouteConfig, RouterOptions} from 'vue-router';
import Vuetify from 'vuetify/lib';
import {ClickOutside, Intersect, Mutate, Resize, Ripple, Scroll, Touch} from 'vuetify/lib/directives';
import vuetifyLocaleFr from 'vuetify/src/locale/fr';
import vuetifyLocaleEs from 'vuetify/src/locale/es';
import IVuetify from 'vuetify/types';
import {UserVuetifyPreset} from 'vuetify/types/services/presets';
import Vuex, {Store, StoreOptions} from 'vuex';

/**
 * Create the app.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function createApp<S extends AppState = AppState, C extends DrawerContextItems = DrawerContextItems>(config?: AppConfig<S, C>): AppVueConfig<S> {
    Vue.config.productionTip = false;
    Vue.use(Meta);
    Vue.use(VueI18n);
    Vue.use(Vuetify, {
        directives: {
            ClickOutside,
            Intersect,
            Mutate,
            Resize,
            Ripple,
            Scroll,
            Touch,
        },
    });
    Vue.use(Vuex);
    Vue.use(Router);

    config = config || {};
    const customConfigVuetify = config.vuetifyPreset || {};
    const customConfigI18n = config.i18n || {} as Dictionary<any>;
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
        config.userContextRedirectOrgRoute,
        config.itemsPerPage,
        config.defaultItemPerPage,
        config.defaultKanbanItemPerPage,
        config.defaultExportFormats,
        config.defaultImportFormats,
    );

    const vuetify = new Vuetify(deepMerge(vuetifyBowPreset, {
        lang: {
            locales: {
                es: vuetifyLocaleEs,
                fr: vuetifyLocaleFr,
            },
        },
    }, customConfigVuetify));

    const i18n = new VueI18n(deepMerge({
        locale: 'en',
        fallbackLocale: 'en',
        messages: {
            en: Object.assign({}, bowLocaleEn),
            es: Object.assign({}, bowLocaleEs),
            fr: Object.assign({}, bowLocaleFr),
        },
    }, customConfigI18n));

    const customRoutes = customConfigRouter.routes || [];
    const customSettingRoutes = customConfigRouter.settingRoutes || [];
    const customAppendRoutes = customConfigRouter.appendRoutes || [];
    const customAppendOrganizationRoutes = customConfigRouter.appendOrganizationRoutes || [];

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
            customSettingRoutes,
            undefined !== config.useStandardLogin ? config.useStandardLogin : true,
            undefined !== config.useOrganizationRoute ? config.useOrganizationRoute : true,
            undefined !== config.useUserSettingsRoute ? config.useUserSettingsRoute : true,
            undefined !== config.useNotFoundRoute ? config.useNotFoundRoute : true,
            undefined !== config.useNotFoundOrganizationRoute ? config.useNotFoundOrganizationRoute : true,
            customAppendRoutes,
            customAppendOrganizationRoutes,
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
            drawer: new DrawerModule(config.drawer ? config.drawer.contextItems : undefined),
            auth: new AuthModule(router, new KlipperAuthManager(apiClient), config.userContextRedirectRoute, config.userContextRedirectOrgRoute),
            account: new AccountModule(apiClient, undefined !== config.onlyOrganizations ? config.onlyOrganizations : true),
            metadata: new MetadataModule(apiClient),
        },
        plugins: [
            createSyncState(),
        ],
    }, customConfigStore({i18n, router, vuetify})));

    const uploader = new Uploader(store, deepMerge({
        locales: {
            fr: uploaderFr,
        },
    }, config.uploader || {} as Dictionary<any>));

    const countryFormatterLocales = config.i18nExtra && config.i18nExtra.countryFormatter
        ? config.i18nExtra.countryFormatter.locales
        : {};

    const dateFormatter = new DateFormatter(i18n);
    const numberFormatter = new NumberFormatter(i18n);
    const countryFormatter = new CountryFormatter(Object.values(Object.assign({}, {
        fr: countryFr,
    }, countryFormatterLocales)) as LocaleData[], i18n);
    const localeFormatter = new LocaleFormatter();

    Vue.use(VueLongClick);
    Vue.use(new VueKlipper(klipper));
    Vue.use(new VueRouterBack(router), {forceHistory: true, rootRoute: config.rootRoute} as RouterBackOptions);
    Vue.use(new VueRouterQuery(router));
    Vue.use(new VueI18nExtra({
        dateFormatter,
        numberFormatter,
        countryFormatter,
        localeFormatter,
    }));
    Vue.use(new VueValidator(new I18nValidator([
        EmailRule,
        JsonRule,
        RequiredRule,
        UrlRule,
        LengthRule,
        RangeRule,
        NumberRule,
    ], i18n)));
    Vue.use(new VueDataTransformer(new DataTransformer([
        new ReadOnlyDataModelTransformer(),
        new FieldEntityChoiceDataModelTransformer(),
        new AssociationDataModelTransformer(),
    ])));
    Vue.use(new VueThemer(store));
    Vue.use(new VueSnackbar());
    Vue.use(new VueAccount(store));
    Vue.use(new VueApi(apiClient));
    Vue.use(new VueUploader(uploader));
    Vue.use(new VueMetadata(store));
    Vue.use(new VueOptionChain());
    Vue.use(new VueSlotWrapper());

    addPreAuthGuard(router);
    addRootRedirectGuard(router, store, APP_CONFIG.assets.baseUrl, config.userContextRedirectRoute, config.userContextRedirectOrgRoute);
    addOrganizationGuard(router, store);
    addAuthGuard(router, store);
    addDefaultToolbarComponentGuard(router, 'toolbar', KSimpleSpacer);
    addDrawerContextGuard(router, 'settings', store);
    addLocaleInterceptor(apiClient, store);
    addTimezoneInterceptor(apiClient, dateFormatter);
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

export interface AppConfig<S extends AppState, C extends DrawerContextItems> {
    appBadgeLight?: any;
    appBadgeDark?: any;
    allowUserContext?: boolean;
    vuetifyPreset?: UserVuetifyPreset;
    i18n?: VueI18n.I18nOptions;
    i18nExtra?: AppI18nExtraConfig;
    drawer?: DrawerOptions<C>;
    router?: AppRouterOptions;
    rootRedirectRoute?: RedirectOption;
    rootRoute?: RawLocation;
    userContextRedirectRoute?: Location;
    userContextRedirectOrgRoute?: Location;
    useStandardLogin?: boolean;
    useOrganizationRoute?: boolean;
    useUserSettingsRoute?: boolean;
    useNotFoundRoute?: boolean,
    useNotFoundOrganizationRoute?: boolean,
    apiClient?: KlipperClientConfig;
    store?: StoreOptions<S>|((partialAppConfig: PartialAppVueConfig) => StoreOptions<S>);
    onlyOrganizations?: boolean;
    uploader?: UploaderOptions;
    itemsPerPage?: number[];
    defaultItemPerPage?: number;
    defaultKanbanItemPerPage?: number;
    defaultExportFormats?: string[];
    defaultImportFormats?: string[];
}

export interface AppRouterOptions extends RouterOptions {
    settingRoutes?: RouteConfig[];
    appendRoutes?: RouteConfig[];
    appendOrganizationRoutes?: RouteConfig[];
}

export interface PartialAppVueConfig extends Dictionary<any> {
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
    locales: Dictionary<LocaleData>;
}
