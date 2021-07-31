/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Selfable} from '@klipper/bow/mixins/Selfable';
import {mixins} from 'vue-class-component';
import {Component, Prop, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KOrgSwitcherHeader extends mixins(
    Selfable,
) {
    @Prop({type: Boolean, default: false})
    public mini: boolean;

    private miniBadgeTooltipDisabled: boolean = false;

    private get useBackgroundInBadge(): boolean {
        return this.hasOrgBadge && this.$store.state.darkMode.enabled;
    }

    private get badgeBackgroundColor(): string {
        return this.useBackgroundInBadge ? 'white' : '';
    }

    private get hasOrgBadge(): boolean {
        return this.$store.getters['account/hasOrganizationImage'];
    }

    private get appBadge(): string {
        return this.$store.state.darkMode.enabled ? this.$klipper.badgeDark : this.$klipper.badgeLight;
    }

    private get badgeUrl(): string|undefined {
        return this.hasOrgBadge ? this.$store.state.account.organizationInfo.imageUrl : '';
    }

    private get hasRetryRequired(): boolean {
        return this.$store.state.account.organizationError
            || (!this.$store.state.account.user && !this.$store.state.account.initializationPending);
    }

    private get isOrganizationSwitcherOpened(): boolean {
        return this.$store.state.account.organizationSwitcherOpen;
    }

    private get title(): string {
        if (this.$store.getters['account/hasOrganizationInfo']) {
            return this.$store.state.account.organizationInfo.label;
        }

        return this.$klipper.allowUserContext && !!this.$store.state.account.user
            ? this.$store.state.account.user.fullName
            : this.$klipper.name;
    }

    private get loading(): boolean {
        return this.$store.state.account.organizationPending;
    }

    public mounted(): void {
        this.watchIsOrganizationSwitcherOpened(this.isOrganizationSwitcherOpened);
    }

    private async retry(): Promise<void> {
        if (!this.$store.state.account.user) {
            await this.$store.dispatch('account/initialize');
        } else {
            await this.$store.dispatch('account/refreshOrganizationInfo');
        }
    }

    @Watch('isOrganizationSwitcherOpened')
    private watchIsOrganizationSwitcherOpened(value: boolean): void {
        this.miniBadgeTooltipDisabled = value;
    }
}
