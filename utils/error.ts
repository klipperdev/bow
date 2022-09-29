/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {HttpClientRequestError} from '@klipper/http-client/errors/HttpClientRequestError';
import {Errors} from '@klipper/http-client/models/responses/Errors';
import Vue from 'vue';

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

        if (vue.$t) {
            switch (err.message) {
                case 'Method Not Allowed':
                    message = vue.$t('error.405-method-not-allowed') as string;
                    break;
                case 'Error network':
                    message = vue.$t('error.network') as string;
                    break;
                case 'Internal Server Error':
                    message = vue.$t('error.500-internal-server-error') as string;
                    break;
                case 'Invalid credentials':
                    message = vue.$t('error.oauth.invalid-credentials') as string;
                    break;
                default:
                    break;
            }
        }

        return message;
    }

    console.error(err);

    return vue.$t ? vue.$t('error.internal') as string : 'Internal error';
}

export function getFormAlertFull(err: Error): string[] {
    return err instanceof HttpClientRequestError && err.errors ? getFullErrorMessages(err.errors) : [];
}

export function getFullErrorMessages(errors: Errors, prefix?: string, excludedChildren?: string[]): string[] {
    let messages: string[] = [];

    for (const error of errors.errors || []) {
        messages.push(prefix ? prefix + ': ' + error : error);
    }

    const children = getFilteredErrorChildren(errors, excludedChildren || []);

    Object.getOwnPropertyNames(children).forEach((childName: string) => {
        if (!childName.startsWith('_')) {
            messages = [
                ...messages,
                ...getFullErrorMessages(children[childName], (prefix ? prefix + '.' : '') + childName),
            ];
        }
    });

    return messages;
}

export function getFilteredErrorChildren(errors: Errors, excludedChildren: string[]): Dictionary<Errors> {
    const children = errors.children || {} as Dictionary<Errors>;
    const values = {} as Dictionary<Errors>;

    Object.getOwnPropertyNames(children).forEach((child: string) => {
        if (!child.startsWith('_') && !excludedChildren.includes(child)) {
            values[child] = children[child];
        }
    });

    return values;
}

export function getFieldErrors(field: string, previousError: HttpClientRequestError|null): string[] {
    return previousError
            && previousError.errors
            && previousError.errors.children
            && previousError.errors.children[field]
        ? getFullErrorMessages(previousError.errors.children[field])
        : [];
}
