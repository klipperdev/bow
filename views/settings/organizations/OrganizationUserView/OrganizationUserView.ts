/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {MetaInfo} from 'vue-meta';
import {Component, Vue, Ref} from 'vue-property-decorator';
import {FetchRequestDataEvent} from '@klipper/bow/http/event/FetchRequestDataEvent';
import ChangePassword from '@klipper/bow/views/settings/organizations/ChangePassword/ChangePassword.vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    components: {
        ChangePassword,
    },
})
export default class OrganizationUserView extends Vue {
    @Ref('sdtView')
    private readonly sdtViewRef!: Vue|any;

    private editPassword: boolean = false;

    protected get allowedFileTypes(): string[] {
        return ['image/*', '.jpg', '.jpeg', '.png', '.tif', '.tiff', '.gif', '.svg', '.webp'];
    }

    public metaInfo(): MetaInfo {
        return {
            title: this.$ml('organization_user'),
        };
    }

    private getUploadImageUrl(id: string | number): string {
        return this.$api.getBaseUrl() + '/' + this.$store.state.account.organization + '/organization_users/' + id + '/user/upload';
    }

    private async onUploadImageComplete(): Promise<void> {
        await this.sdtViewRef.refresh();
    }

    private async fetchRequest(event: FetchRequestDataEvent): Promise<object | null> {
        return await this.$api.request({
            method: 'GET',
            url: '/{organization}/organization_users/' + event.id,
        }, event.canceler);
    }
}
