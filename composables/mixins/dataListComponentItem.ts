/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {inject as RegistrableInject} from '@klipper/bow/composables/mixins/registrable';
import {DataListComponent} from '@klipper/bow/dataList/DataListComponent';
import Vue from 'vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
interface Props {}

interface Data {
    dataListComponent: DataListComponent,
}

interface Computed {}

interface Methods {}

export const DataListComponentItem = Vue.extend<Data, Methods, Computed, Props>({
    name: 'dataListComponentItem',

    mixins: [
        RegistrableInject<'dataComponent', any>('dataComponent'),
    ],

    data(): Data {
        return {
            dataListComponent: (this as any).dataComponent,
        };
    },
});
