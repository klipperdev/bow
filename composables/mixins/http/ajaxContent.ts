/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {BaseAjaxContent} from '@klipper/bow/composables/mixins/http/baseAjaxContent';
import {sendSnackbarErrorMessage} from '@klipper/bow/utils/snackbar';
import {Canceler} from '@klipper/http-client/Canceler';
import {CancelerBag} from '@klipper/http-client/CancelerBag';
import {HttpClientRequestError} from '@klipper/http-client/errors/HttpClientRequestError';
import Vue from 'vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
interface Methods {
    fetchData<D>(request: (canceler: Canceler) => Promise<D | null>,
                 showSnackbar: boolean,
                 showLoading: boolean): Promise<D | null>;
}

export const AjaxContent = Vue.extend<{}, Methods, {}>({
    name: 'ajaxContent',

    mixins: [
        BaseAjaxContent,
    ],

    methods: {
        async fetchData<D>(request: (canceler: Canceler) => Promise<D | null>,
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

                return res as D|null;
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
    },
});
