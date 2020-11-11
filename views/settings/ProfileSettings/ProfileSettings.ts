/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {AjaxFormContent} from '@klipper/bow/mixins/http/AjaxFormContent';
import {AccountState} from '@klipper/bow/stores/account/AccountState';
import {User} from '@klipper/bow/stores/account/User';
import {Canceler} from '@klipper/http-client/Canceler';
import {mixins} from 'vue-class-component';
import {Component, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class ProfileSettings extends mixins(
    AjaxFormContent,
) {
    private firstName: string | null = null;

    private lastName: string | null = null;

    private editMode: boolean = false;

    private get account(): AccountState | undefined {
        return this.$store && this.$store.state.account && this.$store.state.account
            ? this.$store.state.account
            : undefined;
    }

    private get user(): User | undefined {
        return this.account && this.account.user ? this.account.user : undefined;
    }

    private cancel(): void {
        this.editMode = false;
    }

    private async save(): Promise<void> {
        if (this.isValidForm()) {
            const res = await this.fetchData<Dictionary<any>>(async (canceler: Canceler): Promise<Dictionary<any> | null> => {
                return await this.$api.request({
                    url: '/user',
                    method: 'PATCH',
                    data: {
                        first_name: this.firstName,
                        last_name: this.lastName,
                    },
                }, canceler);
            }, false);

            if (res && this.user) {
                this.$store.commit('account/refreshUserSuccess', {
                    id: this.user.id,
                    username: this.user.username,
                    email: this.user.email,
                    lastName: res.last_name,
                    firstName: res.first_name,
                    fullName: res.full_name,
                    initial: res.initial,
                    imageUrl: res.image_url,
                } as User);

                this.editMode = false;
                this.loading = false;
            }
        }
    }

    @Watch('editMode')
    private watchEditMode(): void {
        this.firstName = this.user ? this.user.firstName as string : null;
        this.lastName = this.user ? this.user.lastName as string : null;
    }
}
