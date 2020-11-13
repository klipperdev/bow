/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {DataTransformerEvent} from '@klipper/bow/dataTransformer/event/DataTransformerEvent';
import ChangePassword from '@klipper/bow/views/settings/organizations/ChangePassword/ChangePassword.vue';
import {Component, Ref, Vue} from 'vue-property-decorator';

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

    protected async dataTransformer(event: DataTransformerEvent): Promise<void> {
        event.dataTransformed.user = {
            first_name: event.data.user.first_name,
            last_name: event.data.user.last_name,
            username: event.data.user.username,
            email: event.data.user.email,
            alias: event.data.user.alias,
        };
    }

    private getUploadImageUrl(id: string | number): string {
        return this.$api.getBaseUrl() + '/' + this.$store.state.account.organization + '/organization_users/' + id + '/user/upload';
    }

    private async onUploadImageComplete(): Promise<void> {
        await this.sdtViewRef.refresh();
    }

    private onDeleted(): void {
        this.$router.replace({name: 'settings-org-users'});
    }
}
