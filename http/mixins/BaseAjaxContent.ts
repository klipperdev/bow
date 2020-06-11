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

    public previousRequest?: Canceler;

    public beforeDestroy(): void {
        this.previousError = null;

        if (this.previousRequest) {
            this.previousRequest.cancel();
            this.previousRequest = undefined;
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
}
