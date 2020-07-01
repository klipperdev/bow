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
import {CancelerBag} from '@klipper/http-client/CancelerBag';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class BaseAjaxContent extends Vue {
    protected loading: boolean = false;

    protected previousError: HttpClientRequestError|null = null;

    protected previousRequests: CancelerBag = new CancelerBag();

    public destroyed(): void {
        this.previousRequests.cancelAll();
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
}
