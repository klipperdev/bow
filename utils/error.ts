/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue from 'vue';
import {HttpClientRequestError} from '@klipper/http-client/errors/HttpClientRequestError';

/**
 *  Get the error message of the request.
 *
 * @param {Vue}   vue The vue instance
 * @param {Error} err The request error
 *
 * @return {string}
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function getRequestErrorMessage(vue: Vue, err: Error): string {
    if (err instanceof HttpClientRequestError) {
        let message = err.message;

        if (vue.$i18n) {
            switch (err.message) {
                case 'Error network':
                    message = vue.$i18n.t('error.network') as string;
                    break;
                case 'Internal Server Error':
                    message = vue.$i18n.t('error.500-internal-server-error') as string;
                    break;
                case 'Invalid credentials':
                    message = vue.$i18n.t('error.oauth.invalid_credentials') as string;
                    break;
                default:
                    break;
            }
        }

        return message;
    }

    console.error(err);

    return vue.$i18n ? vue.$i18n.t('error.internal') as string : 'Internal error';
}
