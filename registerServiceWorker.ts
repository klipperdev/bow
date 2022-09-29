/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {SnackbarMessage} from '@klipper/bow/snackbar/SnackbarMessage';
import {createRouterBase} from '@klipper/bow/utils/router';
/* tslint:disable:no-console */
import {register} from 'register-service-worker';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
if (process.env.NODE_ENV === 'production') {
    const baseUrl = createRouterBase(APP_CONFIG.assets.baseUrl, APP_CONFIG.api.baseUrl) || '/';

    register(`${baseUrl}service-worker.js`, {
        ready() {
            console.log('App is being served from cache by a service worker.');
        },
        registered() {
            console.log('Service worker has been registered.');
        },
        cached() {
            console.log('Content has been cached for offline use.');
        },
        updatefound() {
            console.log('New content is downloading.');
        },
        updated() {
            console.log('New content is available; please refresh.');

            self.dispatchEvent(new MessageEvent('klipper-snackbar-push-snack', {
                data: {
                    message: 'sw.app.updated',
                    translatable: true,
                    closeButton: true,
                    multiline: true,
                    timeout: 0,
                    color: 'info',
                } as SnackbarMessage,
                origin: window.location.origin,
            }));
        },
        offline() {
            console.log('No internet connection found. App is running in offline mode.');
        },
        error(error: Error) {
            console.error('Error during service worker registration:', error);
        },
    });
}
