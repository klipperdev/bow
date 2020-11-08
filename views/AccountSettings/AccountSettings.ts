/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {MetaInfo} from 'vue-meta';
import {Component, Vue} from 'vue-property-decorator';
import {User} from '@klipper/bow/stores/account/User';
import {AccountState} from '@klipper/bow/stores/account/AccountState';
import UserSettings from '@klipper/bow/views/settings/UserSettings/UserSettings.vue';
import ProfileSettings from '@klipper/bow/views/settings/ProfileSettings/ProfileSettings.vue';
import OrganizationSettings from '@klipper/bow/views/settings/OrganizationSettings/OrganizationSettings.vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    components: {
        UserSettings,
        ProfileSettings,
        OrganizationSettings,
    },
})
export default class AccountSettings extends Vue {
    protected languageAvailables: LanguageAvailable[] = [];

    protected get allowedFileTypes(): string[] {
        return ['image/*', '.jpg', '.jpeg', '.png', '.tif', '.tiff', '.gif', '.svg', '.webp'];
    }

    private get selectedLanguage(): string {
        let language = this.$store.state.i18n.locale;
        language = this.$i18n.messages[language] ? language : this.$store.state.i18n.fallback;

        return this.$t('languages.' + language) as string;
    }

    private get darkMode(): boolean {
        return this.$store.state.darkMode.enabled;
    }

    private set darkMode(value: boolean) {
        this.$store.commit('darkMode/toggle', value);
    }

    private get account(): AccountState | undefined {
        return this.$store && this.$store.state.account && this.$store.state.account
            ? this.$store.state.account
            : undefined;
    }

    private get user(): User | undefined {
        return this.account && this.account.user ? this.account.user : undefined;
    }

    private get uploadUserImageEndpoint(): string {
        return this.$api.getBaseUrl() + '/user/upload';
    }

    public metaInfo(): MetaInfo {
        return {
            title: this.$t('views.settings.title') as string,
        };
    }

    public created(): void {
        for (const available of Object.keys(this.$i18n.messages)) {
            this.languageAvailables.push({
                code: available,
                label: this.$t('languages.' + available) as string,
            });
        }

        this.languageAvailables.sort((a: LanguageAvailable, b: LanguageAvailable): number => {
            if (a.label < b.label) {
                return -1;
            } else if (a.label > b.label) {
                return 1;
            }

            return 0;
        });
    }
}

interface LanguageAvailable {
    code: string;
    label: string;
}
