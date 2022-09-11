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
import {DataListHeader} from '@klipper/bow/dataList/DataListHeader';
import {DataListOptions} from '@klipper/bow/dataList/DataListOptions';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {ObjectMetadata} from '@klipper/bow/metadata/ObjectMetadata';
import {StandardViewData} from '@klipper/bow/standardView/StandardViewData';
import {HttpClientRequestError} from '@klipper/http-client/errors/HttpClientRequestError';
import {FilterResult} from '@klipper/sdk/models/filters/FilterResult';
import {Sort} from '@klipper/sdk/requests/Sort';
import Vue from 'vue';
import {DataOptions} from 'vuetify';

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
