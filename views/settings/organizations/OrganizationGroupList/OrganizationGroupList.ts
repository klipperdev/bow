/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {DataListHeader} from '@klipper/bow/dataList/DataListHeader';
import {FetchRequestDataListEvent} from '@klipper/bow/http/event/FetchRequestDataListEvent';
import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';
import {MetaInfo} from 'vue-meta';
import {Component, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class OrganizationGroupList extends Vue {
    private get headers(): DataListHeader[] {
        return [
            {
                text: this.$mfl('group', 'label'),
                value: 'label',
            },
            {
                text: this.$mfl('group', 'name'),
                value: 'name',
            },
        ];
    }

    public metaInfo(): MetaInfo {
        return {
            title: this.$mpl('group'),
        };
    }

    private async fetchRequest(event: FetchRequestDataListEvent): Promise<ListResponse> {
        return await this.$api.requestList({
            method: 'GET',
            url: '/{organization}/groups',
            limit: event.limit,
            page: event.page,
            search: event.search || undefined,
            searchFields: event.searchFields || undefined,
            sort: event.sort,
            filter: event.filters || undefined,
            fields: [
                'id',
                'group.label',
                'group.name',
            ],
        }, event.canceler);
    }
}
