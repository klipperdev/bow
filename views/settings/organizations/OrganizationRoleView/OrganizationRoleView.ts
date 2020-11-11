/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {DeleteRequestDataEvent} from '@klipper/bow/http/event/DeleteRequestDataEvent';
import {FetchRequestDataEvent} from '@klipper/bow/http/event/FetchRequestDataEvent';
import {PushRequestDataEvent} from '@klipper/bow/http/event/PushRequestDataEvent';
import {extractIdentifiers} from '@klipper/bow/utils/object';
import {MetaInfo} from 'vue-meta';
import {Component, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class OrganizationRoleView extends Vue {
    public metaInfo(): MetaInfo {
        return {
            title: this.$ml('role'),
        };
    }

    private async fetchRequest(event: FetchRequestDataEvent): Promise<object | null> {
        return await this.$api.request({
            method: 'GET',
            url: '/{organization}/roles/' + event.id,
            params: event.getRequestParams(),
        }, event.canceler);
    }

    private async pushRequest(event: PushRequestDataEvent): Promise<object | null> {
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

    private async deleteRequest(event: DeleteRequestDataEvent): Promise<void> {
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
