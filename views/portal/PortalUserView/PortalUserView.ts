/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {DataTransformerEvent} from '@klipper/bow/dataTransformer/event/DataTransformerEvent';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {StandardPushRequestDataEvent} from '@klipper/bow/http/event/StandardPushRequestDataEvent';
import {SnackbarMessage} from '@klipper/bow/snackbar/SnackbarMessage';
import {setReactiveDeepValue} from '@klipper/bow/utils/object';
import {restoreRouteQuery} from '@klipper/bow/utils/router';
import ChangePassword from '@klipper/bow/views/portal/ChangePassword/ChangePassword.vue';
import PortalUserViewInvitation from '@klipper/bow/views/portal/PortalUserViewInvitation/PortalUserViewInvitation.vue';
import {Component, Ref, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    components: {
        ChangePassword,
        PortalUserViewInvitation,
    },
})
export default class PortalUserView extends Vue {
    @Ref('sdtView')
    private readonly sdtViewRef!: Vue|any;

    private editPassword: boolean = false;

    private createMode: boolean = false;

    private showPassword: boolean = false;

    private createPassword: string|null = null;

    private portal: string|number|null = null;

    protected get allowedFileTypes(): string[] {
        return ['image/*', '.jpg', '.jpeg', '.png', '.tif', '.tiff', '.gif', '.svg', '.webp'];
    }

    private get isInvitation(): boolean {
        return 'create' === this.$route.params.id && !this.createMode;
    }

    public mounted(): void {
        const portal = restoreRouteQuery<any>('portal', this.$route, 'form', {}, 'object');
        this.portal = portal?.id || null;
    }

    protected async dataTransformer(event: DataTransformerEvent): Promise<void> {
        event.dataTransformed.user = {
            first_name: event.data.user.first_name,
            last_name: event.data.user.last_name,
            username: event.data.user.username,
            email: event.data.user.email,
            alias: event.data.user.alias,
            roles: event.data.user.roles,
        };

        if (this.createMode) {
            event.dataTransformed.portal = this.portal;
            event.dataTransformed.user.password = this.createPassword;
        }
    }

    private getUploadImageUrl(id: string | number): string {
        return this.$api.getBaseUrl() + '/' + this.$store.state.account.organization + '/portal_users/' + id + '/user/upload';
    }

    private async onUploadImageComplete(): Promise<void> {
        await this.sdtViewRef.refresh();
    }

    private async createPushRequest(event: StandardPushRequestDataEvent): Promise<Dictionary<any>|null> {
        return await this.$api.request({
            method: event.getMethod(),
            url: event.getPushUrl('/{organization}/portal_users/create'),
            params: event.getRequestParams(),
            data: event.dataTransformed,
        }, event.canceler);
    }

    private onCreated(res: Dictionary<any>): void {
        this.$router.replace({
            name: 'portal-user',
            params: {
                id: res.id,
            },
        });
    }

    private onDeleted(): void {
        this.$router.replace({name: 'portal-users'});
    }

    private onInvited(res: Dictionary<any>): void {
        this.$router.replace({
            name: 'portal-user',
            params: {
                id: res.id,
            },
        });

        const msg = this.$t('views.portal-user.invite-success', {
            full_name: res.user.full_name as string,
        }) as string;
        this.$snackbar.snack(new SnackbarMessage(msg, 'success'));
    }

    private onInvalid(email: string): void {
        this.createMode = true;

        this.$nextTick(() => {
            const data = (this.$refs.sdtView as any).data;
            setReactiveDeepValue(data, 'user.email', email);
            setReactiveDeepValue(data, 'enabled', true);
        });
    }
}
