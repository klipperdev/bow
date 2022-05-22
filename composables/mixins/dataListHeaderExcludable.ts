/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {DataListHeader} from '@klipper/bow/dataList/DataListHeader';
import Vue, {ComponentOptions} from 'vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export const dataListHeaderExcludable: ComponentOptions<Vue|any> = {
    props: {
        excludedHeaders: {
            type: [Array, () => Array],
            default: () => [],
        },
    },

    methods: {
        getFilteredHeaders: function (headers: DataListHeader[]): DataListHeader[] {
            const excludedHeaders = typeof this.excludedHeaders === 'function'
                ? this.excludedHeaders()
                : this.excludedHeaders;

            if (excludedHeaders.length > 0) {
                return headers.filter((header: DataListHeader) => {
                    return !excludedHeaders.includes(header.value);
                });
            }

            return headers;
        },
    },
};