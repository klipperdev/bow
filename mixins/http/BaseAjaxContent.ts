/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {getFieldErrors, getRequestErrorMessage} from '@klipper/bow/utils/error';
import {Canceler} from '@klipper/http-client/Canceler';
import {CancelerBag} from '@klipper/http-client/CancelerBag';
import {HttpClientRequestError} from '@klipper/http-client/errors/HttpClientRequestError';
import Vue from 'vue';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class BaseAjaxContent extends Vue {
    protected loading: boolean = false;

    protected previousError: HttpClientRequestError|null = null;

    protected previousRequests: CancelerBag = new CancelerBag();

    protected get errorCode(): number {
        return this.previousError ? this.previousError.statusCode : 0;
    }

    protected get errorMessage(): string {
        if (this.previousError) {
            let message = '';

            if (this.errorCode > 0) {
                message = this.previousError.statusCode + ' ';
            }

            message += getRequestErrorMessage(this, this.previousError);

            return message;
        }

        return this.$t('error.404-page-not-found') as string;
    }

    public destroyed(): void {
        this.resetPreviousError();
        this.finishLoading();
    }

    public finishLoading(): void {
        if (0 === this.previousRequests.all().length) {
            this.loading = false;
        }
    }

    public fieldErrors(field: string): string[] {
        return getFieldErrors(field, this.previousError);
    }

    public resetPreviousError(): void {
        this.previousRequests.cancelAll();
        this.previousError = null;
    }

    protected hookAfterFetchDataRequest(canceler: Canceler): void {
        this.finishLoading();
    }
}
