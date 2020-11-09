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
import {Errors} from '@klipper/http-client/models/responses/Errors';
import {Dictionary} from '@klipper/bow/generic/Dictionary';

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

export function getFormAlertGlobal(err: Error): string[] {
    return err instanceof HttpClientRequestError && err.errors && err.errors.errors ? err.errors.errors : [];
}

export function getFormAlertFields(err: Error, excludedChildren: string[] = []): Dictionary<Errors> {
    if (err instanceof HttpClientRequestError) {
        const children = err.errors.children || {} as Dictionary<any>;
        const fieldErrors: Dictionary<Errors> = {};

        Object.getOwnPropertyNames(children).forEach((field: string) => {
            if (!excludedChildren.includes(field)) {
                fieldErrors[field] = children[field];
            }
        });

        return fieldErrors;
    }

    return {};
}

export function getFieldErrors(field: string, previousError: HttpClientRequestError|null): string[] {
    return previousError
            && previousError.errors
            && previousError.errors.children
            && previousError.errors.children[field]
            && previousError.errors.children[field].errors
        ? previousError.errors.children[field].errors as string[]
        : [];
}
