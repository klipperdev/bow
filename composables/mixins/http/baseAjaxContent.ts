/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {getFieldErrors, getRequestErrorMessage} from '@klipper/bow/utils/error';
import {CancelerBag} from '@klipper/http-client/CancelerBag';
import {HttpClientRequestError} from '@klipper/http-client/errors/HttpClientRequestError';
import Vue from 'vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
interface Data {
    fetching: boolean;
    loading: boolean;
    previousError: HttpClientRequestError|null;
    previousRequests: CancelerBag,
}

interface Computed {
    get errorCode(): number;
    get errorMessage(): string;
}

interface Methods {
    finishLoading(): void;
    fieldErrors(field: string): string[];
    resetPreviousError(): void;
    hookAfterFetchDataRequest(): void;
}

export const BaseAjaxContent = Vue.extend<Data, Methods, Computed>({
    name: 'baseAjaxContent',

    data() {
        return {
            fetching: false as boolean,
            loading: false,
            previousError: null,
            previousRequests: new CancelerBag(),
        };
    },

    computed: {
        errorCode(): number {
            return this.previousError ? this.previousError.statusCode : 0;
        },

        errorMessage(): string {
            if (this.previousError) {
                let message = '';

                if (this.errorCode > 0) {
                    message = this.previousError.statusCode + ' ';
                }

                message += getRequestErrorMessage(this, this.previousError);

                return message;
            }

            return this.$t('error.404-page-not-found') as string;
        },
    },

    destroyed(): void {
        this.resetPreviousError();
        this.finishLoading();
    },

    methods: {
        finishLoading(): void {
            if (0 === this.previousRequests.all().length) {
                this.loading = false;
                this.fetching = false;
            }
        },

        fieldErrors(field: string): string[] {
            return getFieldErrors(field, this.previousError);
        },

        resetPreviousError(): void {
            this.previousRequests.cancelAll();
            this.previousError = null;
        },

        hookAfterFetchDataRequest(): void {
            this.finishLoading();
        },
    },
});
