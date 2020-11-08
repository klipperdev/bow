/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Component, Watch} from 'vue-property-decorator';
import {mixins} from 'vue-class-component';
import {BaseAjaxOrganizationList} from '@klipper/bow/mixins/http/components/BaseAjaxOrganizationList';
import {Organization} from '@klipper/bow/stores/account/Organization';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KOrgSwitcher extends mixins(
    BaseAjaxOrganizationList,
) {
    private get open(): boolean {
        return this.$store.state.account.organizationSwitcherOpen;
    }

    private set open(value: boolean) {
        if (!this.$store.state.account.initialized) {
            value = false;
        }

        this.$store.state.account.organizationSwitcherOpen = value;
    }

    private get accountInitialized(): boolean {
        return this.$store.state.account.initialized;
    }

    private get userItem(): Organization|null {
        if (!!this.$store.state.account.user
            && ('user' !== this.$store.state.account.organization || this.$klipper.allowUserContext)
        ) {
            return {
                id: this.$store.state.account.user.id,
                name: 'user',
                label: this.$klipper.allowUserContext
                    ? this.$store.state.account.user.fullName
                    : this.$t('my-account'),
                image_url: this.$store.state.account.user.imageUrl,
            };
        }

        return null;
    }

    public async mounted(): Promise<void> {
        window.addEventListener('keyup', this.keyDownHandler);
        if (!this.isInitialized) {
            this.loading = true;
        }

        if (this.open) {
            await this.refresh();
        }
    }

    public destroyed(): void {
        window.removeEventListener('keyup', this.keyDownHandler);
    }

    protected isFetchDataAllowed(): boolean {
        return this.accountInitialized;
    }

    private keyDownHandler(event: KeyboardEvent): void {
        if (event.code === 'Escape' && this.open) {
            this.open = false;
        } else if (event.shiftKey && event.altKey && event.code === 'KeyS') {
            this.open = !this.open;
        }
    }

    @Watch('accountInitialized')
    private async watchInitialized(initialized: boolean): Promise<void> {
        if (!initialized) {
            this.cancel();
            this.pages = -1;
        }
    }

    @Watch('open')
    private async watchOpen(opened: boolean): Promise<void> {
        if (!opened) {
            this.cancel();
        } else if (!this.isInitialized) {
            await this.refresh();
        }
    }
}
