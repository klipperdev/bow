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
import Vue, {PropType} from 'vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
interface Props {
    loading: boolean;
    skeletonLoaderProps?: Dictionary<any>;
    disableLoading: boolean;
    contentWidth: string;
}

interface Computed {
    skeletonLoaderPropsValue: Dictionary<any>;
}

export const SkeletonLoaderable = Vue.extend<{}, {}, Computed, Props>({
    name: 'skeletonLoaderable',

    props: {
        loading: {
            type: Boolean as PropType<boolean>,
            default: false,
        },

        skeletonLoaderProps: {
            type: Object as PropType<Dictionary<any>|undefined>,
        },

        disableLoading: {
            type: Boolean as PropType<boolean>,
            default: false,
        },

        /**
         * Content width average used to create the skeleton loader
         */
        contentWidth: {
            type: String as PropType<string>,
            default: 'random',
        },
    },

    computed: {
        skeletonLoaderPropsValue(): Dictionary<any> {
            let contentWidth = this.contentWidth || undefined;

            if ('random' === contentWidth) {
                contentWidth = randomNumberBetween(30, 80) + '%';
            }

            return Object.assign(
                {class: 'mt-1', type: 'text', width: contentWidth},
                this.skeletonLoaderProps || {},
            );
        },
    },
});
