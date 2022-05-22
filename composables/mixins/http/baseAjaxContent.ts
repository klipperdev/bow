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
import Vue, {ComponentOptions} from 'vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
interface Options extends Vue {
    loading: boolean;
    previousError: HttpClientRequestError|null;
    previousRequests: CancelerBag;
}

export const BaseAjaxContent: ComponentOptions<Vue|Options|any> = {
    name: 'baseAjaxContent',

    data(): Dictionary<any> {
        return {
            loading: false as boolean,
            previousError: null as HttpClientRequestError|null,
            previousRequests: new CancelerBag() as CancelerBag,
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
};
