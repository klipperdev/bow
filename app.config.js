/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

module.exports = {
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
    themes: {
        preloader: {
            background: process.env.APP_THEME_LIGHT_PRELOADER_BG || '#f5f9fc',
        },
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
