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
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KvPortalUserDataList extends Vue {
    @Prop({type: String, default: undefined})
    public routePortalUserView!: string|undefined;

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
                text: this.$mfl('portal_user', 'enabled'),
                value: 'enabled',
            },
            {
                text: this.$mfl('portal_user', 'updated_at'),
                value: 'updated_at',
            },
        ];
    }

    private async fetchRequest(event: FetchRequestDataListEvent): Promise<ListResponse> {
        return await this.$api.requestList({
            method: 'GET',
            url: '/{organization}/portal_users',
            limit: event.limit,
            page: event.page,
            search: event.search || undefined,
            searchFields: event.searchFields || undefined,
            viewsDetails: event.viewsDetails || undefined,
            sort: event.sort,
            filter: event.filters || undefined,
            fields: [
                'id',
                'portal_user.roles',
                'portal_user.updated_at',
                'portal_user.enabled',
                'portal_user.user',
                'user.alias',
                'user.username',
                'user.full_name',
                'user.image_url',
            ],
        }, event.canceler);
    }
}
