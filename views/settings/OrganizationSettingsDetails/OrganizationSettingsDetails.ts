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
import {Organization} from '@klipper/bow/stores/account/Organization';
import {Canceler} from '@klipper/http-client/Canceler';
import {mixins} from 'vue-class-component';
import {Component, Watch} from 'vue-property-decorator';
import {Location} from 'vue-router';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class OrganizationSettingsDetails extends mixins(
    AjaxFormContent,
    Selfable,
) {
    private name: string | null = null;

    private label: string | null = null;

    private editMode: boolean = false;

    private get account(): AccountState | undefined {
        return this.$store && this.$store.state.account && this.$store.state.account
            ? this.$store.state.account
            : undefined;
    }

    private get organization(): Organization | undefined {
        return this.account ? this.account.organizationInfo : undefined;
    }

    private cancel(): void {
        this.editMode = false;
    }

    private async save(): Promise<void> {
        if (this.isValidForm()) {
            const res = await this.fetchData<Dictionary<any>>(async (canceler: Canceler): Promise<Dictionary<any> | null> => {
                return await this.$api.request({
                    url: '/' + this.$org + '/organization',
                    method: 'PATCH',
                    data: {
                        name: this.name,
                        label: this.label,
                    },
                }, canceler);
            }, false);

            if (res) {
                const replaceRouteRequired = this.organization
                    ? this.organization.name !== res.name : false;

                if (replaceRouteRequired) {
                    const cr = this.$router.currentRoute;

                    this.$router.replace({
                        name: cr.name,
                        hash: cr.hash,
                        query: Object.assign({}, cr.query),
                        params: Object.assign({}, cr.params, {
                            org: res.name,
                        }),
                    } as Location).then(() => {});
                } else {
                    this.$store.commit('account/updateOrganizationInfoSuccess', {
                        id: res.id,
                        name: res.name,
                        label: res.label,
                        imageUrl: res.image_url,
                    } as Organization);

                    this.editMode = false;
                    this.loading = false;
                }
            }
        }
    }

    @Watch('editMode')
    private watchEditMode(): void {
        this.name = this.organization ? this.organization.name : null;
        this.label = this.organization ? this.organization.label : null;
    }
}
