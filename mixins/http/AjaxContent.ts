/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {BaseAjaxContent} from '@klipper/bow/mixins/http/BaseAjaxContent';
import {sendSnackbarErrorMessage} from '@klipper/bow/utils/snackbar';
import {Canceler} from '@klipper/http-client/Canceler';
import {HttpClientRequestError} from '@klipper/http-client/errors/HttpClientRequestError';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class AjaxContent extends BaseAjaxContent {
    /**
     * Fetch data.
     */
    public async fetchData<D>(request: (canceler: Canceler) => Promise<D | null>,
                              showSnackbar: boolean = true,
                              showLoading: boolean = true): Promise<D | null> {
        const canceler = new Canceler();
        this.previousRequests.cancelAll();

        try {
            this.loading = showLoading;
            this.previousError = null;
            this.previousRequests.add(canceler);

            const res: D|null = await request(canceler);
            this.previousRequests.remove(canceler);
            this.hookAfterFetchDataRequest();

            return res as D;
        } catch (e: any) {
            this.previousRequests.remove(canceler);
            this.previousError = e as HttpClientRequestError;
            this.loading = false;

            if (showSnackbar) {
                sendSnackbarErrorMessage(this, e);
            }
        }

        return null;
    }
}
