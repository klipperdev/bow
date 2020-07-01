/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue from 'vue';
import {HttpClientRequestError} from '@klipper/http-client/errors/HttpClientRequestError';
import {Canceler} from '@klipper/http-client/Canceler';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class BaseAjaxContent extends Vue {
    public loading: boolean = false;

    public previousError: HttpClientRequestError|null = null;

    public previousRequests: Canceler[] = [];

    public beforeDestroy(): void {
        this.cancelPreviousRequests();
        this.previousError = null;
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

    protected cancelPreviousRequests(): void {
        const previousRequests = this.previousRequests;
        this.previousRequests = [];

        for (const previousRequest of previousRequests) {
            previousRequest.cancel();
        }
    }

    protected removeCanceler(canceler: Canceler): void {
        const  index = this.previousRequests.indexOf(canceler);

        if (index > -1) {
            this.previousRequests.splice(index, 1);
        }
    }
}
