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
import {Canceler} from '@klipper/http-client/Canceler';
import {mixins} from 'vue-class-component';
import {MetaInfo} from 'vue-meta';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class PortalUserViewInvitation extends mixins(
    AjaxFormContent,
) {
    @Prop({type: [String, Number]})
    public portal!: string|number;

    private email: string|null = null;

    public metaInfo(): MetaInfo {
        return {
            title: this.$ml('portal_user') + ' : ' + this.$t('views.portal-user.invite-person'),
        };
    }

    private async send(): Promise<void> {
        if (this.isValidForm()) {
            const res = await this.fetchData<Dictionary<any>>(async (canceler: Canceler): Promise<Dictionary<any>|null> => {
                return await this.$api.request({
                    url: this.$org + '/portal_users/invite',
                    method: 'POST',
                    data: {
                        portal: this.portal || null,
                        email: this.email,
                    },
                }, canceler);
            }, false);

            if (res) {
                this.$emit('invited', res);
            } else if (this.previousError && 404 === this.previousError.statusCode) {
                this.$emit('invalid', this.email);
            }
        }
    }
}
