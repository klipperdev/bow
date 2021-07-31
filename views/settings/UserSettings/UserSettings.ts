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
import {Selfable} from '@klipper/bow/mixins/Selfable';
import {AccountState} from '@klipper/bow/stores/account/AccountState';
import {User} from '@klipper/bow/stores/account/User';
import {Canceler} from '@klipper/http-client/Canceler';
import {mixins} from 'vue-class-component';
import {Component, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class UserSettings extends mixins(
    AjaxFormContent,
    Selfable,
) {
    private username: string | null = null;

    private email: string | null = null;

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
                        username: this.username,
                        email: this.email,
                    },
                }, canceler);
            }, false);

            if (res) {
                const logoutRequired = this.user ? this.user.username !== res.username : false;
                this.$store.commit('account/refreshUserSuccess', {
                    id: res.id,
                    username: res.username || null,
                    email: res.email || null,
                    lastName: res.last_name || null,
                    firstName: res.first_name || null,
                    fullName: res.full_name || null,
                    initial: res.initial || null,
                    imageUrl: res.image_url || null,
                } as User);

                this.editMode = false;
                this.loading = false;

                if (logoutRequired) {
                    await this.$store.dispatch('auth/logout', false);
                }
            }
        }
    }

    @Watch('editMode')
    private watchEditMode(): void {
        this.username = this.user ? this.user.username : null;
        this.email = this.user ? this.user.email : null;
    }
}
