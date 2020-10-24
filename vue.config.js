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
const lodash = require('lodash')
const webpack = require('webpack');

const cwd = process.cwd();
const homePath = process.env.HOME || process.env.USERPROFILE;
dotenv.config({basePath: cwd});

const isProd = 'production' === process.VUE_CLI_SERVICE.mode;
const isDevServer = !isProd && process.argv[2] && 'serve' === process.argv[2];

const serverApiProtocol = process.env.SERVER_PROTOCOL || 'https';
const serverApiPort = parseInt(process.env.SERVER_PORT || 8000);
const serverPort = parseInt(process.env.APP_DEV_SERVER_PORT || (serverApiPort + 2));
const serverPfxPath = process.env.SERVER_PFX || path.resolve(homePath, '.symfony/certs/default.p12');
const serverPfxPassphrase = process.env.SERVER_PFX_PASSPHRASE;
const serverHttps = undefined !== process.env.SERVER_HTTPS ? 1 === parseInt(process.env.SERVER_HTTPS) : fs.existsSync(serverPfxPath);

const srcPath = path.resolve(cwd, 'assets/app');
const publicDir = path.resolve(cwd, 'public');
const distPath = path.resolve(cwd, 'public/assets');
const assetPublicPath = process.env.APP_ASSETS_PUBLIC_PATH || '/assets/';
let serverAssetPath = assetPublicPath.replace(/^[\\/]+|[\\/]+$/g, '');
serverAssetPath = serverAssetPath.length > 0 ? '/' + serverAssetPath : serverAssetPath;

const basePath = process.env.APP_BASE_PATH || '';
const publicCustomPath = path.resolve(cwd, 'assets/public');
const publicBowPath = path.resolve(__dirname, 'public');

const customAppConfigPath = path.resolve(cwd, 'assets/app/app.config.js');
const bowAppConfig = require('@klipper/bow/app.config');
const appConfig = fs.existsSync(customAppConfigPath) ? lodash.merge(bowAppConfig, require(customAppConfigPath)) : bowAppConfig;
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

module.exports = {
    devServer: {
        disableHostCheck: true,
        host: 'localhost',
        port: serverPort,
        https: serverHttps,
        pfx: serverHttps ? serverPfxPath : undefined,
        pfxPassphrase: serverPfxPassphrase,
        compress: true,
        overlay: true,
        stats: 'errors-only',
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        before: function() {
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
        themeColor: appConfig.themes.preloader.background,
        msTileColor: appConfig.themes.preloader.background,
        manifestOptions: {
            start_url: appConfig.assets.pwa.startUrl,
            background_color: appConfig.themes.preloader.background,
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
            importWorkboxFrom: 'cdn',
            exclude: [
                /\.map$/,
                'robots.txt',
            ],
            navigateFallback: appConfig.assets.baseUrl + 'index.html',
        },
    },

    configureWebpack: {
        stats: 'errors-only',
        devtool: isProd ? false : 'eval-source-map',

        performance: {
            hints: false,
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
            args[0].tsconfig = path.resolve(cwd, 'tsconfig.json');
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
            args[0] = args[0].filter((item) => {
                return publicDir !== item.from;
            });

            args[0].push({
                from: publicBowPath,
                to: distPath,
                context: publicBowPath,
                toType: 'dir',
                globOptions: {
                    ignore: [
                        '**.DS_Store',
                        '**.index.html',
                    ],
                },
            });
            args[0].push({
                from: publicCustomPath,
                to: distPath,
                context: publicCustomPath,
                toType: 'dir',
                force: true,
                globOptions: {
                    ignore: [
                        '**.DS_Store',
                        '**.index.html',
                    ],
                },
            });

            return args;
        });

        config.plugin('VuetifyLoaderPlugin').store.set('args', [{
            match (originalTag, { kebabTag, camelTag }) {
                if (kebabTag.startsWith('k-')) {
                    return [camelTag, `import ${camelTag} from '@klipper/bow/components/${camelTag}/${camelTag}.vue'`]
                }
            }
        }]);
    },

    publicPath: assetPublicPath,
    outputDir: `${distPath}/${basePath}`,
    productionSourceMap: false,
    lintOnSave: !isProd,
};
