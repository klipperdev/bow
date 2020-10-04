/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import {HttpClientRequestError} from '@klipper/http-client/errors/HttpClientRequestError';
import {Canceler} from '@klipper/http-client/Canceler';
import {CancelerBag} from '@klipper/http-client/CancelerBag';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class BaseAjaxContent extends Vue {
    protected loading: boolean = false;

    protected previousError: HttpClientRequestError|null = null;

    protected previousRequests: CancelerBag = new CancelerBag();

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
        return this.previousError
                && this.previousError.errors
                && this.previousError.errors.children
                && this.previousError.errors.children[field]
                && this.previousError.errors.children[field].errors
            ? this.previousError.errors.children[field].errors as string[]
            : [];
    }

    public resetPreviousError(): void {
        this.previousRequests.cancelAll();
        this.previousError = null;
    }

    protected hookAfterFetchDataRequest(canceler: Canceler): void {
        this.finishLoading();
    }
}
