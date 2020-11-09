/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Component} from 'vue-property-decorator';
import {Canceler} from '@klipper/http-client/Canceler';
import {HttpClientRequestError} from '@klipper/http-client/errors/HttpClientRequestError';
import {BaseAjaxContent} from '@klipper/bow/mixins/http/BaseAjaxContent';
import {SnackbarMessage} from '@klipper/bow/snackbar/SnackbarMessage';
import {getFormAlertFull, getRequestErrorMessage} from '@klipper/bow/utils/error';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class AjaxContent extends BaseAjaxContent {
    /**
     * Fetch data.
     */
    public async fetchData<D>(request: (canceler: Canceler) => Promise<D | null>,
                              showSnackbar: boolean = true): Promise<D | null> {
        const canceler = new Canceler();
        this.previousRequests.cancelAll();

        try {
            this.loading = true;
            this.previousError = null;
            this.previousRequests.add(canceler);

            const res: D|null = await request(canceler);
            this.previousRequests.remove(canceler);
            this.hookAfterFetchDataRequest(canceler);

            return res as D;
        } catch (e) {
            this.previousRequests.remove(canceler);
            this.previousError = e as HttpClientRequestError;
            this.loading = false;

            if (showSnackbar && this.$snackbar) {
                const errMessage = getRequestErrorMessage(this, e);
                const errErrors = getFormAlertFull(e);
                let snackMessage = errMessage;

                if (errErrors.length > 0) {
                    snackMessage += '<div class="mt-2"><ul>';

                    for (const errError of errErrors) {
                        snackMessage += '<li>' + errError + '</li>';
                    }

                    snackMessage += '</ul></div>';
                }

                this.$snackbar.snack((new SnackbarMessage(snackMessage, 'error'))
                    .setMultiLine(errErrors.length > 0));
            }
        }

        return null;
    }
}
