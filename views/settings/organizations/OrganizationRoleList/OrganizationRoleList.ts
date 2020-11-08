/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {MetaInfo} from 'vue-meta';
import {Component, Vue} from 'vue-property-decorator';
import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';
import {FetchRequestDataListEvent} from '@klipper/bow/http/event/FetchRequestDataListEvent';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class OrganizationRoleList extends Vue {
    private get headers(): object[] {
        return [
            {
                text: this.$mfl('role', 'label'),
                align: 'left',
                value: 'label',
            },
            {
                text: this.$mfl('role', 'name'),
                align: 'left',
                value: 'name',
            },
        ];
    }

    public metaInfo(): MetaInfo {
        return {
            title: this.$mpl('role'),
        };
    }

    private async fetchRequest(event: FetchRequestDataListEvent): Promise<ListResponse> {
        return await this.$api.requestList({
            method: 'GET',
            url: '/{organization}/roles',
            limit: event.limit,
            page: event.page,
            search: event.search || undefined,
            sort: event.sort,
            filter: event.filters || undefined,
            fields: [
                'id',
                'role.label',
                'role.name',
            ],
        }, event.canceler);
    }
}
