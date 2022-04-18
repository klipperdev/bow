/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {randomNumberBetween} from '@klipper/bow/utils/number';
import {computed, Data, PropType, reactive, Ref, ref, toRefs} from '@vue/composition-api';
import Vue from 'vue';
import {ComponentOptions} from 'vue/types/options';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function useSkeletonLoaderable() {
    const state = reactive<SkeletonLoaderableState>({
        loading: false,
        skeletonLoaderProps: undefined,
        disableLoading: false,
        contentWidth: 'random',
    });

    const skeletonLoaderPropsValue = computed(() => {
        let contentWidth = state.contentWidth || undefined;

        if ('random' === contentWidth) {
            contentWidth = randomNumberBetween(30, 80) + '%';
        }

        return Object.assign(
            {class: 'mt-1', type: 'text', width: contentWidth},
            state.skeletonLoaderProps || {},
        );
    });

    return {
        ...toRefs(state),
        skeletonLoaderPropsValue,
    };
}

export interface SkeletonLoaderableState {
    loading: boolean,
    skeletonLoaderProps: Dictionary<any> | undefined,
    disableLoading: boolean,
    contentWidth: string,
}
