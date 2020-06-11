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
        return 'Error network' === err.message && vue.$i18n
            ? vue.$i18n.t('error.network') as string
            : err.message;
    }

    console.error(err);

    return vue.$i18n ? vue.$i18n.t('error.internal') as string : 'Internal error';
}
