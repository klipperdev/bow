/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {FormContent} from '@klipper/bow/mixins/http/FormContent';
import {Selfable} from '@klipper/bow/mixins/Selfable';
import {getRequestErrorMessage} from '@klipper/bow/utils/error';
import {mixins} from 'vue-class-component';
import {MetaInfo} from 'vue-meta';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class Login extends mixins(
    FormContent,
    Selfable,
) {
    private username?: string|null = null;

    private password?: string|null = null;

    private showPassword: boolean = false;

    private formAlert: string|null = null;

    private get pending(): boolean {
        return this.$store.state.auth.authenticationPending || this.$store.state.auth.authenticated;
    }

    private get badge() {
        return this.$store.state.darkMode.enabled ? this.$klipper.badgeDark : this.$klipper.badgeLight;
    }

    private get appName(): string {
        return this.$klipper.name;
    }

    private get showFormAlert(): boolean {
        return null !== this.formAlert;
    }

    public metaInfo(): MetaInfo {
        return {
            title: this.$t('views.login.title') as string,
        };
    }

    public async beforeDestroy(): Promise<void> {
        await this.$store.dispatch('auth/cancel');
    }

    private async login(): Promise<void> {
        if (this.isValidForm()) {
            try {
                await this.$store.dispatch('auth/login', {
                    username: this.username,
                    password: this.password,
                });
            } catch (e) {
                this.formAlert = getRequestErrorMessage(this, e);
            }
        }
    }
}
