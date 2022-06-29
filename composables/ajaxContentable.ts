/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {getFieldErrors, getRequestErrorMessage} from '@klipper/bow/utils/error';
import {randomNumberBetween} from '@klipper/bow/utils/number';
import {sendSnackbarErrorMessage} from '@klipper/bow/utils/snackbar';
import {Canceler} from '@klipper/http-client/Canceler';
import {CancelerBag} from '@klipper/http-client/CancelerBag';
import {HttpClientRequestError} from '@klipper/http-client/errors/HttpClientRequestError';
import {computed, Data, onDeactivated, PropType, reactive, Ref, ref, toRefs} from '@vue/composition-api';
import Vue from 'vue';
import {ComponentOptions} from 'vue/types/options';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function useBaseAjaxContentable(vue: Vue) {
    const loading = ref<boolean>(false);
    const showLoadingRef = ref<boolean>(false);
    const previousError = ref<HttpClientRequestError|null>(null);
    const previousRequests = ref<CancelerBag>(new CancelerBag());

    const errorCode = computed((): number => {
        return previousError.value ? previousError.value.statusCode : 0;
    });

    const errorMessage = computed((): string => {
        if (previousError.value) {
            let message = '';

            if (errorCode.value > 0) {
                message = previousError.value.statusCode + ' ';
            }

            message += getRequestErrorMessage(vue, previousError.value);

            return message;
        }

        return vue.$t('error.404-page-not-found') as string;
    });

    const finishLoading = (): void => {
        if (0 === previousRequests.value.all().length) {
            loading.value = false;
        }
    };

    const fieldErrors = (field: string): string[] => {
        // @ts-ignore
        return getFieldErrors(field, previousError.value);
    };

    const resetPreviousError = (): void => {
        previousRequests.value.cancelAll();
        previousError.value = null;
    };

    const defaultHookAfterFetchDataRequest = (): void => {
        finishLoading();
    };

    onDeactivated((): void => {
        resetPreviousError();
        finishLoading();
    });

    return {
        loading,
        showLoading: showLoadingRef,
        previousError,
        previousRequests,
        errorCode,
        errorMessage,
        finishLoading,
        fieldErrors,
        resetPreviousError,
        defaultHookAfterFetchDataRequest,
    };
}

export function useAjaxContentable(vue: Vue, customHookAfterFetchDataRequest?: Function|undefined) {
    const {
        defaultHookAfterFetchDataRequest,
        errorCode,
        errorMessage,
        fieldErrors,
        finishLoading,
        loading,
        showLoading: showLoadingRef,
        previousError,
        previousRequests,
        resetPreviousError,
    } = useBaseAjaxContentable(vue);

    const fetchData = async <D>(
        request: (canceler: Canceler) => Promise<D | null>,
        showSnackbar: boolean = true,
        showLoading: boolean = true): Promise<D | null> => {
            const canceler = new Canceler();
            previousRequests.value.cancelAll();

            try {
                loading.value = showLoading;
                showLoadingRef.value = showLoading;
                previousError.value = null;
                previousRequests.value.add(canceler);

                const res: D|null = await request(canceler);
            previousRequests.value.remove(canceler);

            if (customHookAfterFetchDataRequest) {
                customHookAfterFetchDataRequest();
            } else {
                defaultHookAfterFetchDataRequest();
            }

            return res as D;
        } catch (e: any) {
                previousRequests.value.remove(canceler);
                previousError.value = e as HttpClientRequestError;
                loading.value = false;

                if (showSnackbar) {
                    sendSnackbarErrorMessage(vue, e);
                }
            }

            return null;
        }

    return {
        defaultHookAfterFetchDataRequest,
        errorCode,
        errorMessage,
        fetchData,
        fieldErrors,
        finishLoading,
        loading,
        previousError,
        previousRequests,
        resetPreviousError,
    }
}
