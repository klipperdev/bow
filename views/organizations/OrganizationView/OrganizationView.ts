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
import {MetaInfo} from 'vue-meta';
import {Component, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class OrganizationCreate extends Vue {
    public metaInfo(): MetaInfo {
        return {
            title: this.$ml('organization'),
        };
    }

    private async fetchRequest(event: FetchRequestDataEvent): Promise<Dictionary<any>|null> {
        return await this.$api.request({
            method: 'GET',
            url: '/{organization}/organizations/' + event.id,
        }, event.canceler);
    }

    private async pushRequest(event: PushRequestDataEvent): Promise<Dictionary<any>|null> {
        return await this.$api.request({
            method: event.getMethod(),
            url: event.getPushUrl('/{organization}/organizations'),
            data: {
                name: event.data.name,
                label: event.data.label,
            },
        }, event.canceler);
    }

    private onCreated(res: Dictionary<any>): void {
        this.$router.replace({
            name: 'user-organization',
            params: {
                id: res.id,
            },
        });
    }

    private async deleteRequest(event: DeleteRequestDataEvent): Promise<void> {
        await this.$api.request({
            url: '/{organization}/organizations/' + event.id,
            method: 'DELETE',
        }, event.canceler);
    }

    private onDeleted(): void {
        this.$router.replace('/');
    }
}
