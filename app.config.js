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
            background: process.env.APP_THEME_LIGHT_PRELOADER_BG || '#f8f9fd',
        },
        light: {
            primary: process.env.APP_THEME_LIGHT_PRIMARY || '#384d76',
            secondary: process.env.APP_THEME_LIGHT_SECONDARY || '#3F4A56',
            accent: process.env.APP_THEME_LIGHT_ACCENT || '#47c1af',
            error: process.env.APP_THEME_LIGHT_ERROR || '#f44336',
            warning: process.env.APP_THEME_LIGHT_WARNING || '#f9a825',
            info: process.env.APP_THEME_LIGHT_INFO || '#4fc3f7',
            success: process.env.APP_THEME_LIGHT_SUCCESS || '#4caf50',
        },
        dark: {
            primary: process.env.APP_THEME_DARK_PRIMARY || '#6185cc',
            secondary: process.env.APP_THEME_DARK_SECONDARY || '#3F4A56',
            accent: process.env.APP_THEME_DARK_ACCENT || '#47c1af',
            error: process.env.APP_THEME_DARK_ERROR || '#f44336',
            warning: process.env.APP_THEME_DARK_WARNING || '#f9a825',
            info: process.env.APP_THEME_DARK_INFO || '#4fc3f7',
            success: process.env.APP_THEME_DARK_SUCCESS || '#4caf50',
        },
    },
};
