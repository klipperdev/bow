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
import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';
import {BaseAjaxContent} from './BaseAjaxContent';
import {SnackbarMessage} from '../../snackbar/SnackbarMessage';
import {getRequestErrorMessage} from '../../utils/error';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class AjaxListContent<I extends object> extends BaseAjaxContent {
    public headers: object[] = [];

    public items: I[] = [];

    public page: number = 1;

    public limit: number = 20;

    public pages: number = 1;

    public total: number = 0;

    public search: string = '';

    public get firstLoading(): boolean {
        return 0 === this.total && this.loading;
    }

    public get hasNoItems(): boolean {
        return 0 === this.items.length && !this.search;
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
        await this.fetchData(this.search, showSnackbar);
    }

    /**
     * Fetch data.
     *
     * @param {string}  [searchValue] The search value
     * @param {boolean} showSnackbar  Check if the error message must be displayed
     */
    public async fetchData(searchValue?: string, showSnackbar: boolean = true): Promise<void> {
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
                this.pages = res.pages;
                this.total = res.total;
            }

            this.items = [];

            for (const result of res.results) {
                this.items.push(result);
            }
        } catch (e) {
            this.previousRequests.remove(canceler);
            this.previousError = e;
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
}
