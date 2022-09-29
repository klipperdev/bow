/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {SnackbarMessage} from '@klipper/bow/snackbar/SnackbarMessage';
import {getFormAlertFull, getRequestErrorMessage} from '@klipper/bow/utils/error';
import {HttpClientRequestError} from '@klipper/http-client/errors/HttpClientRequestError';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function sendSnackbarErrorMessage(vue: Vue, err: Error, metadata?: string, excludedChildren?: string[]): void {
    if (vue.$snackbar) {
        const errMessage = getRequestErrorMessage(vue, err);

        vue.$snackbar.snack({
            message: getRequestErrorMessage(vue, err),
            color: 'error',
            errors: err instanceof HttpClientRequestError && err.errors ? err.errors : undefined,
            metadata,
            excludedChildren,
        });
    }
}
