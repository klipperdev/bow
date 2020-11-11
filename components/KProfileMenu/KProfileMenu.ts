/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AccountState} from '@klipper/bow/stores/account/AccountState';
import {User} from '@klipper/bow/stores/account/User';
import {Component, Vue, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KProfileMenu extends Vue {
    private menu: boolean = false;

    private disabled: boolean = true;

    private get account(): AccountState|undefined {
        return this.$store && this.$store.state.account
            ? this.$store.state.account
            : undefined;
    }

    private get user(): User|undefined {
        return this.account && this.account.user ? this.account.user : undefined;
    }

    public mounted(): void {
        this.watchUser(!!this.user);
    }

    @Watch('user')
    public watchUser(value: boolean): void {
        this.disabled = !value;
    }

    private get initial(): string {
        return this.user && this.account && this.account.user ? this.account.user.initial : '';
    }

    private get pending(): boolean {
        if (this.$store) {
            const accountPending = this.$store.state.account
                ? this.$store.state.account.initializationPending
                : false;
            const authPending = this.$store.state.auth
                ? this.$store.state.auth.authenticationPending
                : false;
            const logoutPending = this.$store.state.auth
                ? this.$store.state.auth.logoutPending
                : false;

            return accountPending || authPending || logoutPending;
        }

        return false;
    }

    private async logout(): Promise<void> {
        this.menu = false;

        if (this.$store && this.$store.state.auth) {
            await this.$store.dispatch('auth/logout');
        }
    }

    private async retry(): Promise<void> {
        if (!this.user) {
            await this.$store.dispatch('account/initialize');
        }
    }
}
