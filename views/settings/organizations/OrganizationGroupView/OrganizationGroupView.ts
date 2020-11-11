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
import ChangePassword from '@klipper/bow/views/settings/organizations/ChangePassword/ChangePassword.vue';
import {MetaInfo} from 'vue-meta';
import {Component, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    components: {
        ChangePassword,
    },
})
export default class OrganizationGroupView extends Vue {
    public metaInfo(): MetaInfo {
        return {
            title: this.$ml('group'),
        };
    }

    private async fetchRequest(event: FetchRequestDataEvent): Promise<object | null> {
        return await this.$api.request({
            method: 'GET',
            url: '/{organization}/groups/' + event.id,
            params: event.getRequestParams(),
        }, event.canceler);
    }

    private async pushRequest(event: PushRequestDataEvent): Promise<object | null> {
        return await this.$api.request({
            method: event.getMethod(),
            url: event.getPushUrl('/{organization}/groups'),
            params: event.getRequestParams(),
            data: {
                name: event.data.name,
                label: event.data.label,
                roles: extractIdentifiers<string>('name', event.data.roles),
            },
        }, event.canceler);
    }

    private onCreated(res: Dictionary<any>): void {
        this.$router.replace({
            name: 'settings-org-group',
            params: {
                id: res.id,
            },
        });
    }

    private async deleteRequest(event: DeleteRequestDataEvent): Promise<void> {
        await this.$api.request({
            url: '/{organization}/groups/' + event.id,
            method: 'DELETE',
            params: event.getRequestParams(),
        }, event.canceler);
    }

    private onDeleted(): void {
        this.$router.replace({name: 'settings-org-groups'});
    }
}
