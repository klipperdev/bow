/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {DataListOptions} from '@klipper/bow/dataList/DataListOptions';
import {DataListHeader} from '@klipper/bow/dataList/DataListHeader';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {HttpClientRequestError} from '@klipper/http-client/errors/HttpClientRequestError';
import {FilterResult} from '@klipper/sdk/models/filters/FilterResult';
import {Sort} from '@klipper/sdk/requests/Sort';
import {DataOptions} from 'vuetify';
import Vue from 'vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface DataListComponent<I extends Dictionary<any> = Dictionary<any>> extends Vue {
    headers: DataListHeader[],
    items: I[],
    page: number,
    limit: number,
    pages: number,
    total: number,
    search: string,
    fetching: boolean,
    loading: boolean,
    externalLoading: boolean,
    refresh: (showSnackbar: boolean, topOnRefresh: boolean) => Promise<void>,
    refreshToFirstPage: () => Promise<void>,
    resetSelection: () => Promise<void>,
    metadata: string,
    tableAttrs: Dictionary<any>,
    tableOn: Dictionary<any>,
    queryBuilderAttrs: Dictionary<any>,
    queryBuilderOn: Dictionary<any>,
    itemClass?: string|Function,
    isSortable: boolean,
    isMultiSortable: boolean,
    requestSort: Sort[],
    requestFilters: FilterResult,
    showSelect: boolean,
    singleSelect: boolean,
    tableOptions: DataListOptions,
    itemKey: string,
    itemsPerPage: number[],
    onUpdatedOptions: (options: DataOptions) => Promise<void>,
    previousError: HttpClientRequestError|null,
    onToggleAlert: (open: boolean) => void,
    errorCode: number,
    errorMessage: string,
    noResultLarge: boolean,
    isExportAvailable: boolean,
    isImportAvailable: boolean,
    exportFields: string[],
    searchFields: string[],
    topOnRefresh: boolean,
    isInitialized: boolean,
    hasPagination: boolean,
    firstLoading: boolean,
    hasNoItems: boolean,
    retryRefresh: boolean,
    cancel: () => void,
    reset: () => void,
    previousPage: () => Promise<void>,
    nextPage: () => Promise<void>,
    deleteItem: (value: string|number, key: string) => number,
    fetchData: (searchValue: string|undefined, showSnackbar: boolean, topOnRefresh: boolean) => Promise<void>,
}
