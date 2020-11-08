/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Component, Prop, Watch} from 'vue-property-decorator';
import {mixins} from 'vue-class-component';
import {AjaxFormContent} from '@klipper/bow/mixins/http/AjaxFormContent';
import {Canceler} from '@klipper/http-client/Canceler';
import {SnackbarMessage} from '@klipper/bow/snackbar/SnackbarMessage';
import {Dictionary} from '@klipper/bow/generic/Dictionary';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class ChangePassword extends mixins(
    AjaxFormContent,
) {
    @Prop({type: [String, Number], required: true})
    public userId: string|number;

    @Prop({type: String, default: '600'})
    public maxWidth: string;

    private newPassword: string|null = null;

    private showNewPassword: boolean = false;

    private dialog: boolean = false;

    public async save(): Promise<void> {
        if (this.isValidForm()) {
            const res = await this.fetchData<Dictionary<any>>(async (canceler: Canceler): Promise<Record<string, any>|null> => {
                return await this.$api.request({
                    url: '/{organization}/organization_users/' + this.userId + '/change-password',
                    method: 'PATCH',
                    data: {
                        new_password: this.newPassword,
                    },
                }, canceler);
            }, false);

            if (null !== res) {
                this.dialog = false;
                this.$snackbar.snack(new SnackbarMessage(this.$t('views.settings-organization-user.password-changed-successfully') as string, 'success'));
            }
        }
    }

    @Watch('dialog')
    private watchEditMode(): void {
        this.newPassword = null;
        this.resetForm();
    }
}
