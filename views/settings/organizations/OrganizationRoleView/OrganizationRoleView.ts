/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {StandardDeleteRequestDataEvent} from '@klipper/bow/http/event/StandardDeleteRequestDataEvent';
import {StandardFetchRequestDataEvent} from '@klipper/bow/http/event/StandardFetchRequestDataEvent';
import {StandardPushRequestDataEvent} from '@klipper/bow/http/event/StandardPushRequestDataEvent';
import {extractIdentifiers} from '@klipper/bow/utils/object';
import {Component, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class OrganizationRoleView extends Vue {
    private async fetchRequest(event: StandardFetchRequestDataEvent): Promise<object | null> {
        return await this.$api.request({
            method: 'GET',
            url: '/{organization}/roles/' + event.id,
            params: event.getRequestParams(),
        }, event.canceler);
    }

    private async pushRequest(event: StandardPushRequestDataEvent): Promise<object | null> {
        return await this.$api.request({
            method: event.getMethod(),
            url: event.getPushUrl('/{organization}/roles'),
            params: event.getRequestParams(),
            data: {
                name: event.data.name,
                label: event.data.label,
                children: extractIdentifiers<string>('name', event.data.children),
            },
        }, event.canceler);
    }

    private onCreated(res: Dictionary<any>): void {
        this.$router.replace({
            name: 'settings-org-role',
            params: {
                id: res.id,
            },
        });
    }

    private async deleteRequest(event: StandardDeleteRequestDataEvent): Promise<void> {
        await this.$api.request({
            url: '/{organization}/roles/' + event.id,
            method: 'DELETE',
            params: event.getRequestParams(),
        }, event.canceler);
    }

    private onDeleted(): void {
        this.$router.replace({name: 'settings-org-roles'});
    }
}
