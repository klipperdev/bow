/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const path = require('path');
const dotenv = require('@klipper/dotenv-symfony');
const webpack = require('webpack');

const cwd = process.cwd();
dotenv.config({basePath: cwd});

const isProd = 'production' === process.VUE_CLI_SERVICE.mode;
const serverApiPort = parseInt(process.env.SERVER_PORT || 8000);
const serverPort = serverApiPort + 2;
const srcPath = path.resolve(cwd, 'assets/app');
const distPath = path.resolve(cwd, 'public/assets');
const basePath = process.env.APP_BASE_PATH || '';
const appName = process.env.APP_NAME || 'Klipper';
const appBgColor = process.env.APP_BG_COLOR || '#f8f9fd';
const version = require(path.resolve(cwd, 'package.json')).version;

const webpackPlugin = [
    new webpack.DefinePlugin({
        __VERSION__: JSON.stringify(version),
    }),
];

module.exports = {
    devServer: {
        disableHostCheck: true,
        host: 'localhost',
        port: serverPort,
        compress: true,
        overlay: true,
        stats: 'errors-only',
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },

    css: {
        sourceMap: true,
    },

    pwa: {
        name: appName,
        appleMobileWebAppCapable: 'yes',
        themeColor: appBgColor,
        msTileColor: appBgColor,
        manifestOptions: {
            start_url: './index.html',
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
            navigateFallback: `index.html`,
        },
    },

    configureWebpack: {
        stats: 'errors-only',
        devtool: isProd ? false : 'eval-source-map',

        performance: {
            hints: false
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

        config.plugin('copy').tap(args => {
            const publicDir = path.resolve(process.cwd(), 'public');
            const newArgs = [];

            for (const arg of args) {
                newArgs.push(arg.filter((item) => {
                    return publicDir !== item.from;
                }));
            }

            return newArgs;
        });
    },

    publicPath: ``,
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
