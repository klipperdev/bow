/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
import {DataListHeader} from '@klipper/bow/dataList/DataListHeader';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class DataListHeaderExcludable extends Vue {
    @Prop({type: [Array, () => Array], default: () => {
        return [];
    }})
    public excludedHeaders!: string[]|Function;

    protected getFilteredHeaders(headers: DataListHeader[]): DataListHeader[] {
        const excludedHeaders = typeof this.excludedHeaders === 'function' ? this.excludedHeaders() : this.excludedHeaders;

        if (excludedHeaders.length > 0) {
            return headers.filter((header: DataListHeader) => {
                return !excludedHeaders.includes(header.value);
            });
        }

        return headers;
    }
}
