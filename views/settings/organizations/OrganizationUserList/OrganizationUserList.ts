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
export default class OrganizationUserList extends Vue {
    private get headers(): DataListHeader[] {
        return [
            {
                text: '',
                value: 'image',
                width: 40,
            },
            {
                text: this.$mfl('user', 'full_name'),
                value: 'name',
                sortPath: ['user.first_name', 'user.last_name'],
            },
            {
                text: this.$mfl('organization_user', 'enabled'),
                value: 'enabled',
            },
            {
                text: this.$mfl('organization_user', 'updated_at'),
                value: 'updated_at',
            },
        ];
    }

    public metaInfo(): MetaInfo {
        return {
            title: this.$mpl('organization_user'),
        };
    }

    private async fetchRequest(event: FetchRequestDataListEvent): Promise<ListResponse> {
        return await this.$api.requestList({
            method: 'GET',
            url: '/{organization}/organization_users',
            limit: event.limit,
            page: event.page,
            search: event.search || undefined,
            sort: event.sort,
            filter: event.filters || undefined,
            fields: [
                'id',
                'organization_user.roles',
                'organization_user.updated_at',
                'organization_user.enabled',
                'organization_user.user',
                'user.alias',
                'user.username',
                'user.full_name',
                'user.image_url',
            ],
        }, event.canceler);
    }
}
