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
import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';
import {BaseAjaxContent} from './BaseAjaxContent';
import {SnackbarMessage} from '../../snackbar/SnackbarMessage';
import {getRequestErrorMessage} from '../../utils/error';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class AjaxListContent<I extends object = object> extends BaseAjaxContent {
    public headers: object[] = [];

    public items: I[] = [];

    public page: number = 1;

    public limit: number = 20;

    public pages: number = -1;

    public total: number = 0;

    public search: string = '';

    public get isInitialized(): boolean {
        return this.pages >= 0;
    }

    public get hasPagination(): boolean {
        return this.pages > 1;
    }

    public get firstLoading(): boolean {
        return !this.isInitialized && this.loading;
    }

    public get hasNoItems(): boolean {
        return 0 === this.items.length && !this.search;
    }

    public cancel(): void {
        if (this.previousRequests.all().length > 0) {
            this.pages = -1;
        }

        this.previousRequests.cancelAll();
    }

    /**
     * Delete the item by the unique key.
     *
     * @param {string|number} value The value unique key
     * @param {string}        key   The property name of the key
     */
    public deleteItem(value: string|number, key: string = 'id'): number {
        const res = this.items.findIndex((item: any) => {
            return item[key] === value;
        });

        if (res >= 0) {
            this.items.splice(res, 1);

            if (this.total) {
                this.total--;
            }
        }

        return res;
    }

    public async refresh(showSnackbar: boolean = true): Promise<void> {
        await this.fetchData(this.search ? this.search : undefined, showSnackbar);
    }

    /**
     * Fetch data.
     *
     * @param {string}  [searchValue] The search value
     * @param {boolean} showSnackbar  Check if the error message must be displayed
     */
    public async fetchData(searchValue?: string, showSnackbar: boolean = true): Promise<void> {
        if (!this.isFetchDataAllowed()) {
            return;
        }

        const canceler = new Canceler();
        this.previousRequests.cancelAll();

        try {
            this.loading = true;
            this.previousError = null;
            this.page = undefined !== searchValue ? 1 : this.page;
            this.previousRequests.add(canceler);

            const res = await this.fetchDataRequest(canceler, searchValue ? searchValue : '');
            this.previousRequests.remove(canceler);

            if (res.page > 0) {
                this.page = res.page;
                this.limit = res.limit;
                this.total = res.total;
                this.hookAfterFetchDataRequestList(res);
            }

            const items = [];

            for (const result of res.results) {
                items.push(result);
            }

            this.items = items;
            this.hookAfterFetchDataRequest(canceler);
        } catch (e) {
            this.previousRequests.remove(canceler);
            this.previousError = e as HttpClientRequestError;
            this.loading = false;

            if (showSnackbar && this.$snackbar) {
                this.$snackbar.snack(new SnackbarMessage(getRequestErrorMessage(this, e), 'error'));
            }
        }
    }

    /**
     * Request of fetch data.
     *
     * @param {Canceler} canceler    The request canceler
     * @param {string}   searchValue The search value
     */
    public async fetchDataRequest(canceler: Canceler, searchValue: string): Promise<ListResponse<I>> {
        return {results: [], page: 0, limit: 0, pages: 0, total: 0} as ListResponse<I>;
    }

    protected isFetchDataAllowed(): boolean {
        return true;
    }

    protected hookAfterFetchDataRequestList(res: ListResponse<I>): void {
        this.pages = res.pages;
    }
}
