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

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function sendSnackbarErrorMessage(vue: Vue, err: Error): void {
    if (vue.$snackbar) {
        const errMessage = getRequestErrorMessage(vue, err);
        const errErrors = getFormAlertFull(err);
        let snackMessage = errMessage;

        if (errErrors.length > 0) {
            snackMessage += '<div class="mt-2"><ul>';

            for (const errError of errErrors) {
                snackMessage += '<li>' + errError + '</li>';
            }

            snackMessage += '</ul></div>';
        }

        vue.$snackbar.snack({
            message: snackMessage,
            multiline: errErrors.length > 0,
            color: 'error',
        });
    }
}
