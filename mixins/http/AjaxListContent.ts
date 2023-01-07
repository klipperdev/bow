/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {BaseAjaxContent} from '@klipper/bow/mixins/http/BaseAjaxContent';
import {OnlineCheckable} from '@klipper/bow/mixins/OnlineCheckable';
import {sendSnackbarErrorMessage} from '@klipper/bow/utils/snackbar';
import {Canceler} from '@klipper/http-client/Canceler';
import {HttpClientRequestError} from '@klipper/http-client/errors/HttpClientRequestError';
import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';
import {mixins} from 'vue-class-component';
import {Component, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class AjaxListContent<I extends object = Dictionary<any>> extends mixins(
    BaseAjaxContent,
    OnlineCheckable,
) {
    public headers: Array<Dictionary<any>> = [];

    public items: I[] = [];

    public page: number = 1;

    public limit: number = this.$klipper ? this.$klipper.defaultItemPerPage : 20;

    public pages: number = -1;

    public total: number = 0;

    public search: string = '';

    protected retryRefresh: boolean = false;

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

    public reset(): void {
        this.search = '';
        this.pages = -1;
        this.items = [];
    }

    public async previousPage(): Promise<void> {
        if (this.page > 1) {
            this.page--;
            await this.refresh(true, true);
        }
    }

    public async nextPage(): Promise<void> {
        if (this.page < this.pages) {
            this.page++;
            await this.refresh(true, true);
        }
    }

    public async refreshToFirstPage(): Promise<void> {
        if (this.hasPagination && this.page > 1) {
            this.page = 1;
        }

        await this.refresh(true, true);
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

    public async refresh(showSnackbar: boolean = true, topOnRefresh: boolean = false): Promise<void> {
        await this.fetchData(this.search ? this.search : undefined, showSnackbar, topOnRefresh);
    }

    /**
     * Fetch data.
     *
     * @param {string}  [searchValue] The search value
     * @param {boolean} showSnackbar  Check if the error message must be displayed
     * @param {boolean} topOnRefresh  Check if the scroll top must be reset
     */
    public async fetchData(searchValue?: string, showSnackbar: boolean = true, topOnRefresh: boolean = false): Promise<void> {
        if (!this.isFetchDataAllowed()) {
            return;
        }

        const canceler = new Canceler();
        this.previousRequests.cancelAll();
        this.retryRefresh = false;

        try {
            this.loading = true;
            this.previousError = null;
            this.previousRequests.add(canceler);
            await this.hookBeforeFetchDataRequestList(topOnRefresh);

            const res = await this.fetchDataRequest(canceler, searchValue ? searchValue : '');
            this.previousRequests.remove(canceler);

            if (res.page > 0) {
                this.page = res.page;
                this.total = res.total;
            }

            await this.hookAfterFetchDataRequestList(res, topOnRefresh);
            const items = [];

            for (const result of res.results) {
                items.push(result);
            }

            this.items = items;
            this.hookAfterFetchDataRequest();
        } catch (e: any) {
            this.previousRequests.remove(canceler);
            this.previousError = e as HttpClientRequestError;
            this.loading = false;

            if ( 0 === this.errorCode) {
                this.retryRefresh = true;
            }

            if (showSnackbar) {
                sendSnackbarErrorMessage(this, e);
            }
        }
    }

    /**
     * Request of fetch data.
     *
     * @param {Canceler} canceler    The request canceler
     * @param {string}   searchValue The search value
     */
    protected async fetchDataRequest(canceler: Canceler, searchValue: string): Promise<ListResponse<I>> {
        return {results: [], page: 0, limit: 0, pages: 0, total: 0} as ListResponse<I>;
    }

    protected isFetchDataAllowed(): boolean {
        return true;
    }

    /**
     * @param topOnRefresh
     */
    protected async hookBeforeFetchDataRequestList(topOnRefresh: boolean = false): Promise<void> {
        // Override this method
    }

    /**
     * @param res
     * @param topOnRefresh
     */
    protected async hookAfterFetchDataRequestList(res: ListResponse<I>, topOnRefresh: boolean = false): Promise<void> {
        if (res.page > 0) {
            this.pages = res.pages;
        }
    }

    @Watch('online')
    private watchOnline(online: boolean): void {
        if (online && this.retryRefresh) {
            this.refresh().then();
        }
    }
}
