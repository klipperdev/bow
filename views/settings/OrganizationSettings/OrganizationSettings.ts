/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Selfable} from '@klipper/bow/mixins/Selfable';
import {AccountState} from '@klipper/bow/stores/account/AccountState';
import {Organization} from '@klipper/bow/stores/account/Organization';
import OrganizationSettingsDetails from '@klipper/bow/views/settings/OrganizationSettingsDetails/OrganizationSettingsDetails.vue';
import {mixins} from 'vue-class-component';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    components: {
        OrganizationSettingsDetails,
    },
})
export default class OrganizationSettings extends mixins(
    Selfable,
) {
    protected get allowedFileTypes(): string[] {
        return ['image/*', '.jpg', '.jpeg', '.png', '.tif', '.tiff', '.gif', '.svg', '.webp'];
    }

    private get account(): AccountState | undefined {
        return this.$store && this.$store.state.account && this.$store.state.account
            ? this.$store.state.account
            : undefined;
    }

    private get organization(): Organization | undefined {
        return this.account && this.account.organizationInfo ? this.account.organizationInfo : undefined;
    }

    private get imageBackgroundColor(): string {
        return this.organization && this.organization.imageUrl
            ? (this.$store.state.darkMode.enabled ? 'white' : '')
            : 'primary';
    }

    private get uploadOrganizationImageEndpoint(): string {
        return this.$api.getBaseUrl() + '/' + this.$store.state.account.organization + '/organization/upload';
    }
}
