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
import {Component, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class OrganizationView extends Vue {
    private async fetchRequest(event: StandardFetchRequestDataEvent): Promise<Dictionary<any>|null> {
        return await this.$api.request({
            method: 'GET',
            url: '/{organization}/organizations/' + event.id,
        }, event.canceler);
    }

    private async pushRequest(event: StandardPushRequestDataEvent): Promise<Dictionary<any>|null> {
        return await this.$api.request({
            method: event.getMethod(),
            url: event.getPushUrl('/{organization}/organizations'),
            data: event.dataTransformed,
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

    private async deleteRequest(event: StandardDeleteRequestDataEvent): Promise<void> {
        await this.$api.request({
            url: '/{organization}/organizations/' + event.id,
            method: 'DELETE',
        }, event.canceler);
    }

    private onDeleted(): void {
        this.$router.replace('/');
    }
}
