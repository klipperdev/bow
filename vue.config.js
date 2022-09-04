/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const fs = require('fs-extra');
const path = require('path');
const dotenv = require('@klipper/dotenv-symfony');
const merge = require('lodash.merge');
const webpack = require('webpack');
const {defineConfig} = require('@vue/cli-service')

const bowAppConfig = {
    name: process.env.APP_NAME || 'Klipper',
    version: undefined,
    api: {
        baseUrl: process.env.APP_API_BASE_URL || '/api',
        oauth: {
            baseUrl: process.env.APP_OAUTH_BASE_URL,
            clientId: process.env.APP_OAUTH_CLIENT_ID,
            scope: process.env.APP_OAUTH_SCOPE || '*',
        },
    },
    assets: {
        baseUrl: '/',
        pwa: {
            startUrl: '.',
        },
    },
    preloader: {
        background: process.env.APP_THEME_LIGHT_PRELOADER_BG || '#f5f9fc',
    },
    themes: {
        light: {
            primary: process.env.APP_THEME_LIGHT_PRIMARY || '#48bac1',
            secondary: process.env.APP_THEME_LIGHT_SECONDARY || '#21949e',
            accent: process.env.APP_THEME_LIGHT_ACCENT || '#354052',
            error: process.env.APP_THEME_LIGHT_ERROR || '#ed3859',
            warning: process.env.APP_THEME_LIGHT_WARNING || '#fd854e',
            info: process.env.APP_THEME_LIGHT_INFO || '#1ac0ff',
            success: process.env.APP_THEME_LIGHT_SUCCESS || '#3eb772',
        },
        dark: {
            primary: process.env.APP_THEME_DARK_PRIMARY || '#75bfc3',
            secondary: process.env.APP_THEME_DARK_SECONDARY || '#bcdfe2',
            accent: process.env.APP_THEME_DARK_ACCENT || '#7b93b9',
            error: process.env.APP_THEME_DARK_ERROR || '#ed3859',
            warning: process.env.APP_THEME_DARK_WARNING || '#fd854e',
            info: process.env.APP_THEME_DARK_INFO || '#1ac0ff',
            success: process.env.APP_THEME_DARK_SUCCESS || '#3eb772',
        },
    },
};

/**
 * @callback chainVueConfigCallback
 * @param    {import('@vue/cli-service/types/index').ProjectOptions} vueConfig
 */

/**
 * @param {{
 *     name?: string,
 *     version?: string,
 *     api?: {
 *         baseUrl?: string,
 *         oauth?: {
 *             baseUrl?: string,
 *             clientId?: string,
 *             scope?: string,
 *         },
 *     },
 *     assets?: {
 *         baseUrl?: string,
 *         pwa?: {
 *             startUrl?: string,
 *         },
 *     },
 *     preloader?: {
 *         background?: string,
 *     },
 * }} [customAppConfig]
 *
 * @param {chainVueConfigCallback} [chainVueConfig]
 *
 * @return {import('@vue/cli-service/types/index').ProjectOptions}
 */
const createConfig = function(customAppConfig, chainVueConfig) {
    const cwd = process.cwd();
    const homePath = process.env.HOME || process.env.USERPROFILE;
    dotenv.config({basePath: cwd});

    const isProd = 'production' === process.VUE_CLI_SERVICE.mode;
    const isDevServer = !isProd && process.argv[2] && 'serve' === process.argv[2];

    const serverApiProtocol = process.env.SERVER_PROTOCOL || 'https';
    const serverApiPort = parseInt(process.env.SERVER_PORT || 8000);
    const serverPort = parseInt(process.env.APP_DEV_SERVER_PORT || (serverApiPort + 2));
    const serverHttpsKeyPath = process.env.SERVER_PFX || path.resolve(homePath, '.symfony/certs/default.key');
    const serverHttpsCrtPath = process.env.SERVER_PFX || path.resolve(homePath, '.symfony/certs/default.crt');
    const serverHttpsPassphrase = process.env.SERVER_HTTPS_PASSPHRASE;
    const serverHttps = (
            undefined === process.env.SERVER_HTTPS
            || (undefined !== process.env.SERVER_HTTPS && 1 === parseInt(process.env.SERVER_HTTPS))
        )
        && fs.existsSync(serverHttpsKeyPath)
        && fs.existsSync(serverHttpsCrtPath)
    ;

    const srcPath = path.resolve(cwd, 'assets/app');
    const publicDir = path.resolve(cwd, process.env.APP_PUBLIC_PATH || 'public');
    const distPath = path.resolve(cwd, process.env.APP_DIST_PATH || 'public/assets');
    const assetPublicPath = process.env.APP_ASSETS_PUBLIC_PATH || '/assets/';
    let serverAssetPath = assetPublicPath.replace(/^[\\/]+|[\\/]+$/g, '');
    serverAssetPath = serverAssetPath.length > 0 ? '/' + serverAssetPath : serverAssetPath;

    const publicCustomPath = path.resolve(cwd, 'assets/public');
    const publicBowPath = path.resolve(__dirname, 'public');

    const appConfig = merge(bowAppConfig, customAppConfig || {});
    appConfig.version = require(path.resolve(cwd, 'package.json')).version;
    appConfig.assets.baseUrl = '/' + path.relative(publicDir, distPath) + '/';
    appConfig.assets.pwa.startUrl = '/' + path.relative(publicDir, distPath);

    if (isDevServer) {
        if (!appConfig.api.baseUrl.includes('://')) {
            appConfig.api.baseUrl = `${serverApiProtocol}://localhost:${serverApiPort}` + appConfig.api.baseUrl;
        }

        if (!appConfig.api.oauth.baseUrl.includes('://')) {
            appConfig.api.oauth.baseUrl = `${serverApiProtocol}://localhost:${serverApiPort}` + appConfig.api.oauth.baseUrl;
        }
    }

    appConfig.api.baseUrl = appConfig.api.baseUrl.replace(/[\\/]+$/g, '');
    appConfig.api.oauth.baseUrl = appConfig.api.oauth.baseUrl.replace(/[\\/]+$/g, '');

    const webpackPlugin = [
        new webpack.DefinePlugin({
            APP_CONFIG: JSON.stringify(appConfig),
        }),
    ];

    const vueConfig = defineConfig({
        devServer: {
            host: 'localhost',
            port: serverPort,
            compress: true,
            https: serverHttps, // Keep this deprecated options to show the links with HTTPS in CLI output
            server: {
                type: serverHttps ? 'https' : 'http',
                options: serverHttps ? {
                    key: fs.readFileSync(serverHttpsKeyPath),
                    cert: fs.readFileSync(serverHttpsCrtPath),
                    passphrase: serverHttpsPassphrase,
                    requestCert: false,
                } : undefined,
            },
            client: {
                overlay: true,
                logging: 'error',
            },
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            onListening: function() {
                if (isDevServer) {
                    fs.removeSync(distPath);
                    fs.ensureDirSync(distPath);
                    fs.writeJsonSync(path.resolve(distPath, 'remote-assets-config.json'), {
                        assetBaseUrl: `http${serverHttps ? 's' : ''}://localhost:${serverPort}${serverAssetPath}`,
                    });
                }
            },
        },

        css: {
            sourceMap: true,
            loaderOptions: {
                sass: {
                    additionalData: fs.existsSync(srcPath + '/styles/variables.scss')
                        ? '@import "@app/styles/variables.scss"'
                        : '@import "@klipper/bow/styles/variables.scss"',
                },
                scss: {
                    additionalData: fs.existsSync(srcPath + '/styles/variables.scss')
                        ? '@import "@app/styles/variables.scss";'
                        : '@import "@klipper/bow/styles/variables.scss";',
                }
            }
        },

        pwa: {
            name: appConfig.name,
            appleMobileWebAppCapable: 'yes',
            themeColor: appConfig.preloader.background,
            msTileColor: appConfig.preloader.background,
            manifestOptions: {
                start_url: appConfig.assets.pwa.startUrl,
                background_color: appConfig.preloader.background,
                icons: [
                    {
                        'src': appConfig.assets.baseUrl + 'img/icons/android-chrome-192x192.png',
                        'sizes': '192x192',
                        'type': 'image/png',
                    },
                    {
                        'src': appConfig.assets.baseUrl + 'img/icons/android-chrome-512x512.png',
                        'sizes': '512x512',
                        'type': 'image/png',
                    },
                    {
                        'src': appConfig.assets.baseUrl + 'img/icons/android-chrome-maskable-192x192.png',
                        'sizes': '192x192',
                        'type': 'image/png',
                        'purpose': 'maskable',
                    },
                    {
                        'src': appConfig.assets.baseUrl + 'img/icons/android-chrome-maskable-512x512.png',
                        'sizes': '512x512',
                        'type': 'image/png',
                        'purpose': 'maskable',
                    }
                ],
            },
            workboxPluginMode: 'GenerateSW',
            workboxOptions: {
                cleanupOutdatedCaches: true,

                exclude: [
                    /\.map$/,
                    /\.gitignore$/,
                    /\.gitkeep$/,
                    'robots.txt',
                ],
                navigateFallback: appConfig.assets.baseUrl + 'index.html',
            },
        },

        configureWebpack: {
            target: 'web',
            stats: 'errors-only',
            devtool: isProd ? false : 'eval-source-map',

            performance: {
                hints: false,
            },

            snapshot: {
                managedPaths: [],
            },

            plugins: webpackPlugin,
            resolve: {
                alias: {
                    '@app': srcPath,
                },
            },
        },

        'chainWebpack': config => {
            config.entry('app')
                .delete('./src/main.ts')
                .add('./' + path.relative(cwd, srcPath + '/main.ts').replace(/\\/g, '/'))
            ;

            config.plugin('fork-ts-checker').tap(args => {
                args[0].typescript.configFile = path.resolve(cwd, 'tsconfig.json');

                return args;
            });

            // Replace the default index.html template and add app config in template
            config.plugin('html').tap(args => {
                const bowIndexPath = path.resolve(publicBowPath, 'index.html');
                const customIndexPath = path.resolve(publicCustomPath, 'index.html');

                for (const config of args) {
                    if (config.template.includes('index-default.html')) {
                        config.title = appConfig.name;

                        // Use the index.html template in bow
                        if (fs.existsSync(bowIndexPath)) {
                            config.template = bowIndexPath;
                        }

                        // Use the index.html template in project
                        if (fs.existsSync(customIndexPath)) {
                            config.template = customIndexPath;
                        }

                        const prevTemplateParameters = config.templateParameters;
                        config.templateParameters = (compilation, assets, assetTags, options) => {
                            const params = prevTemplateParameters(compilation, assets, assetTags, options);
                            params.appConfig = appConfig;

                            return params;
                        };
                    }
                }

                return args;
            });

            // Remove the copy of public directory in project and copy custom public directories
            config.plugin('copy').tap(args => {
                args[0].patterns = args[0].patterns.filter((item) => {
                    return publicDir !== item.from;
                });

                args[0].patterns.push({
                    from: publicBowPath,
                    to: distPath,
                    context: publicBowPath,
                    toType: 'dir',
                    globOptions: {
                        ignore: [
                            '**.DS_Store',
                            '**/index.html',
                        ],
                    },
                });
                args[0].patterns.push({
                    from: publicCustomPath,
                    to: distPath,
                    context: publicCustomPath,
                    toType: 'dir',
                    force: true,
                    globOptions: {
                        ignore: [
                            '**.DS_Store',
                            '**/index.html',
                        ],
                    },
                });

                return args;
            });

            config.plugin('VuetifyLoaderPlugin').store.set('args', [{
                match (originalTag, { kebabTag, camelTag }) {
                    if (kebabTag.startsWith('k-')) {
                        return [camelTag, `import ${camelTag} from '@klipper/bow/components/${camelTag}/${camelTag}.vue'`]
                    } else if (kebabTag.startsWith('kv-')) {
                        return [camelTag, `import ${camelTag} from '@klipper/bow/views/components/${camelTag}/${camelTag}.vue'`]
                    }
                }
            }]);
        },

        publicPath: assetPublicPath,
        outputDir: distPath,
        productionSourceMap: false,
        lintOnSave: !isProd,
    });

    if (typeof chainVueConfig === 'function') {
        chainVueConfig(vueConfig);
    }

    return vueConfig;
};

module.exports = {
    createConfig,
};
