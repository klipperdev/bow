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
            background: process.env.APP_THEME_LIGHT_PRELOADER_BG || '#fafbfd',
        },
        light: {
            primary: process.env.APP_THEME_LIGHT_PRIMARY || '#2b50ee',
            secondary: process.env.APP_THEME_LIGHT_SECONDARY || '#0c8be8',
            accent: process.env.APP_THEME_LIGHT_ACCENT || '#2b50ee',
            error: process.env.APP_THEME_LIGHT_ERROR || '#ed3859',
            warning: process.env.APP_THEME_LIGHT_WARNING || '#fd854e',
            info: process.env.APP_THEME_LIGHT_INFO || '#1ac0ff',
            success: process.env.APP_THEME_LIGHT_SUCCESS || '#3eb772',
        },
        dark: {
            primary: process.env.APP_THEME_DARK_PRIMARY || '#5994ff',
            secondary: process.env.APP_THEME_DARK_SECONDARY || '#d8e5ff',
            accent: process.env.APP_THEME_DARK_ACCENT || '#5994ff',
            error: process.env.APP_THEME_DARK_ERROR || '#ed3859',
            warning: process.env.APP_THEME_DARK_WARNING || '#fd854e',
            info: process.env.APP_THEME_DARK_INFO || '#1ac0ff',
            success: process.env.APP_THEME_DARK_SUCCESS || '#3eb772',
        },
    },
};
