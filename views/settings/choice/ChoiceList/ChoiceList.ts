/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {FetchRequestDataListEvent} from '@klipper/bow/http/event/FetchRequestDataListEvent';
import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';
import {MetaInfo} from 'vue-meta';
import {Component, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class ChoiceList extends Vue {
    private get headers(): object[] {
        return [
            {
                text: this.$mfl('choice', 'label'),
                value: 'label',
            },
            {
                text: this.$mfl('choice', 'type'),
                value: 'type',
            },
            {
                text: this.$mfl('choice', 'value'),
                value: 'value',
            },
            {
                text: this.$mfl('choice', 'position'),
                value: 'position',
            },
            {
                text: this.$mfl('choice', 'updated_at'),
                value: 'updated_at',
            },
        ];
    }

    public metaInfo(): MetaInfo {
        return {
            title: this.$mpl('choice'),
        };
    }

    private async fetchRequest(event: FetchRequestDataListEvent): Promise<ListResponse> {
        return await this.$api.requestList({
            method: 'GET',
            url: '/{organization}/choices',
            limit: event.limit,
            page: event.page,
            search: event.search || undefined,
            sort: event.sort,
            filter: event.filters || undefined,
            fields: [
                'id',
                'choice.type',
                'choice.label',
                'choice.value',
                'choice.position',
                'choice.color',
                'choice.updated_at',
            ],
        }, event.canceler);
    }
}
