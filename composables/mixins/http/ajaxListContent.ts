/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {BaseAjaxContent} from '@klipper/bow/composables/mixins/http/baseAjaxContent';
import {OnlineCheckable} from '@klipper/bow/composables/mixins/onlineCheckable';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {SnackbarMessage} from '@klipper/bow/snackbar/SnackbarMessage';
import {consoleWarn} from '@klipper/bow/utils/console';
import {getRequestErrorMessage} from '@klipper/bow/utils/error';
import {Canceler} from '@klipper/http-client/Canceler';
import {CancelerBag} from '@klipper/http-client/CancelerBag';
import {HttpClientRequestError} from '@klipper/http-client/errors/HttpClientRequestError';
import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';
import Vue from 'vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
interface Data<I extends Dictionary<any>> {
    headers: Array<Dictionary<any>>;
    items: I[];
    page: number;
    limit: number;
    pages: number;
    total: number;
    search: string;
}

interface Computed {
    get isInitialized(): boolean;
    get hasPagination(): boolean;
    get firstLoading(): boolean;
    get hasNoItems(): boolean;
}

interface Methods {
    cancel(): void;
    reset(): void;
    previousPage(): Promise<void>;
    nextPage(): Promise<void>;
    refreshToFirstPage(): Promise<void>;
    deleteItem(value: string|number, key: string): number;
    refresh(showSnackbar: boolean, topOnRefresh: boolean): Promise<void>;
    fetchData(searchValue?: string, showSnackbar?: boolean, topOnRefresh?: boolean): Promise<void>;
    /**
     * Override this method to fetch data.
     */
    fetchDataRequest<I extends object = Dictionary<any>>(canceler: Canceler, searchValue: string): Promise<ListResponse<I>>;
    isFetchDataAllowed(): boolean;
    hookBeforeFetchDataRequestList(topOnRefresh: boolean): Promise<void>;
    hookAfterFetchDataRequestList<I extends object = Dictionary<any>>(res: ListResponse<I>, topOnRefresh: boolean): Promise<void>;
}

export const AjaxListContent = Vue.extend<Data<Dictionary<any>>, Methods, Computed>({
    name: 'ajaxListContent',

    mixins: [
        BaseAjaxContent,
        OnlineCheckable,
    ],

    data<I>() {
        return {
            headers: [] as Array<Dictionary<any>>,
            items: [] as I[],
            page: 1 as number,
            limit: this.$klipper?.defaultItemPerPage || 20 as number,
            pages: -1 as number,
            total: 0 as number,
            search: '' as string,
            retryRefresh: false as boolean,
        };
    },

    computed: {
        isInitialized(): boolean {
            return this.pages >= 0;
        },

        hasPagination(): boolean {
            return this.pages > 1;
        },

        firstLoading(): boolean {
            return !this.isInitialized && this.loading;
        },

        hasNoItems(): boolean {
            return 0 === this.items.length && !this.search;
        },
    },

    watch: {
        online: {
            async handler(online: boolean): Promise<void> {
                if (online && this.retryRefresh) {
                    await this.refresh();
                }
            },
        },
    },

    methods: {
        cancel(): void {
            if (this.previousRequests.all().length > 0) {
                this.pages = -1;
            }

            this.previousRequests.cancelAll();
        },

        reset(): void {
            this.search = '';
            this.pages = -1;
            this.items = [];
        },

        async previousPage(): Promise<void> {
            if (this.page > 1) {
                this.page--;
                await this.refresh(true, true);
            }
        },

        async nextPage(): Promise<void> {
            if (this.page < this.pages) {
                this.page++;
                await this.refresh(true, true);
            }
        },

        async refreshToFirstPage(): Promise<void> {
            if (this.hasPagination && this.page > 1) {
                this.page = 1;
            }

            await this.refresh(true, true);
        },

        /**
         * Delete the item by the unique key.
         *
         * @param {string|number} value The value unique key
         * @param {string}        key   The property name of the key
         */
        deleteItem(value: string|number, key: string = 'id'): number {
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
        },

        async refresh(showSnackbar: boolean = true, topOnRefresh: boolean = false): Promise<void> {
            await this.fetchData(this.search ? this.search : undefined, showSnackbar, topOnRefresh);
        },

        /**
         * Fetch data.
         *
         * @param {string}  [searchValue] The search value
         * @param {boolean} showSnackbar  Check if the error message must be displayed
         * @param {boolean} topOnRefresh  Check if the scroll top must be reset
         */
        async fetchData(searchValue?: string, showSnackbar: boolean = true, topOnRefresh: boolean = false): Promise<void> {
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

                if (showSnackbar && this.$snackbar) {
                    this.$snackbar.snack(new SnackbarMessage(getRequestErrorMessage(this, e), 'error'));
                }
            }
        },

        /**
         * Override this method to fetch data.
         *
         * Request of fetch data.
         *
         * @param {Canceler} canceler    The request canceler
         * @param {string}   searchValue The search value
         */
        async fetchDataRequest<I extends object = Dictionary<any>>(canceler: Canceler, searchValue: string): Promise<ListResponse<I>> {
            consoleWarn('The "fetchDataRequest" method must be overrided to fetch custom data. You can use the simple signature: async fetchDataRequest(canceler: Canceler, searchValue: string): Promise<ListResponse> {}');

            return {results: [], page: 0, limit: 0, pages: 0, total: 0} as ListResponse<I>;
        },

        isFetchDataAllowed(): boolean {
            return true;
        },

        /**
         * @param topOnRefresh
         */
        async hookBeforeFetchDataRequestList(topOnRefresh: boolean = false): Promise<void> {
            // Override this method
        },

        /**
         * @param res
         * @param topOnRefresh
         */
        async hookAfterFetchDataRequestList<I extends object = Dictionary<any>>(res: ListResponse<I>, topOnRefresh: boolean = false): Promise<void> {
            if (res.page > 0) {
                this.pages = res.pages;
            }
        },
    },
});
