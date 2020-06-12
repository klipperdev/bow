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
const webpack = require('webpack');

const cwd = process.cwd();
const homePath = process.env.HOME || process.env.USERPROFILE;
dotenv.config({basePath: cwd});

const isProd = 'production' === process.VUE_CLI_SERVICE.mode;
const isDevServer = !isProd && process.argv[2] && 'serve' === process.argv[2];

const serverApiProtocol = parseInt(process.env.SERVER_PROTOCOL || 'https');
const serverApiPort = parseInt(process.env.SERVER_PORT || 8000);
const serverPort = serverApiPort + 2;
const serverPfxPath = process.env.SERVER_PFX || path.resolve(homePath, '.symfony/certs/default.p12');
const serverPfxPassphrase = process.env.SERVER_PFX_PASSPHRASE;
const serverHttps = undefined !== process.env.SERVER_HTTPS ? 1 === parseInt(process.env.SERVER_HTTPS) : fs.existsSync(serverPfxPath);

const srcPath = path.resolve(cwd, 'assets/app');
const publicDir = path.resolve(cwd, 'public');
const distPath = path.resolve(cwd, 'public/assets');

const basePath = process.env.APP_BASE_PATH || '';
const publicCustomPath = path.resolve(cwd, 'assets/public');
const publicBowPath = path.resolve(__dirname, 'public');
const appName = process.env.APP_NAME || 'Klipper';
const appBgColor = process.env.APP_BG_COLOR || '#f8f9fd';
const version = require(path.resolve(cwd, 'package.json')).version;

const webpackPlugin = [
    new webpack.DefinePlugin({
        __VERSION__: JSON.stringify(version),
        VUE_APP_API_URL: isDevServer ? JSON.stringify(`${serverApiProtocol}://localhost:${serverApiPort}`) : undefined,
        ASSET_BASE_URL: JSON.stringify('/' + path.relative(publicDir, distPath) + '/'),
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
                    assetBaseUrl: `http${serverHttps ? 's' : ''}://localhost:${serverPort}`,
                });
            }
        },
    },

    css: {
        sourceMap: true,
        loaderOptions: {
            sass: {
                prependData: fs.existsSync(srcPath + '/styles/variables.scss') ? '@import "@app/styles/variables.scss"' : '',
            },
            scss: {
                prependData: fs.existsSync(srcPath + '/styles/variables.scss') ? '@import "@app/styles/variables.scss";' : '',
            }
        }
    },

    pwa: {
        name: appName,
        appleMobileWebAppCapable: 'yes',
        themeColor: appBgColor,
        msTileColor: appBgColor,
        manifestOptions: {
            start_url: '.',
            background_color: appBgColor,
        },
        workboxPluginMode: 'GenerateSW',
        workboxOptions: {
            cleanupOutdatedCaches: true,
            importWorkboxFrom: 'cdn',
            exclude: [
                /\.map$/,
                'robots.txt',
            ],
            navigateFallback: 'index.html',
        },
    },

    configureWebpack: {
        stats: 'errors-only',
        devtool: isProd ? false : 'eval-source-map',

        performance: {
            hints: isProd ? 'error' : false,
            maxEntrypointSize: 5120000,
            maxAssetSize: 1024000,
        },

        plugins: webpackPlugin,
        resolve: {
            alias: {
                '@app': srcPath,
            },
        },
    },

    'chainWebpack': config => {
        config.plugin('fork-ts-checker').tap(args => {
            args[0].tsconfig = path.resolve(cwd, 'tsconfig.json');
            return args;
        });

        // Replace the default index.html template
        config.plugin('html-app').tap(args => {
            const bowIndexPath = path.resolve(publicBowPath, 'index.html');
            const customIndexPath = path.resolve(publicCustomPath, 'index.html');

            for (const config of args) {
                if ('index.html' === config.filename) {
                    // Use the index.html template in bow
                    if (fs.existsSync(bowIndexPath)) {
                        config.template = bowIndexPath;
                    }

                    // Use the index.html template in project
                    if (fs.existsSync(customIndexPath)) {
                        config.template = customIndexPath;
                    }
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
                //force: true,
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

    publicPath: '',
    outputDir: `${distPath}/${basePath}`,
    productionSourceMap: false,
    lintOnSave: !isProd,

    pages: {
        app: {
            entry: path.resolve(cwd, srcPath + '/main.ts'),
            filename: 'index.html',
            title: appName,
        },
    },
};
