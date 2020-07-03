<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-container>
        <v-row no-gutters justify="center" align-content="space-between">
            <v-col cols="12" sm="10" md="8" xl="6">
                <v-subheader :class="$classes('primary--text', 'text--lighten-3')">
                    {{ $t('views.settings.user-account') }}
                </v-subheader>
                <v-card flat>
                    <v-list two-line>
                        <v-list-item>
                            <!-- Profile Image -->
                            <v-list-item-avatar color="primary">
                                <v-fade-transition mode="out-in">
                                    <k-img v-if="user && user.imageUrl"
                                           :api-src="user.imageUrl"
                                           mode="cover"
                                    >
                                        <template v-slot:default="{loaded}">
                                            <v-row v-if="!loaded"
                                                   class="fill-height ma-0"
                                                   align="center"
                                                   justify="center"
                                            >
                                                    <span class="white--text text-h6">
                                                        {{ user.initial }}
                                                    </span>
                                            </v-row>
                                        </template>
                                    </k-img>

                                    <v-icon v-else dark>fa fa-user-alt</v-icon>
                                </v-fade-transition>
                            </v-list-item-avatar>

                            <!-- Profile Info -->
                            <v-list-item-content>
                                <v-list-item-title class="font-weight-bold">
                                    <slot name="title" :account="account" :user="user">
                                        {{ user.fullName || user.email }}
                                    </slot>
                                </v-list-item-title>

                                <v-scale-transition mode="out-in">
                                    <v-list-item-subtitle v-if="!!user.fullName">
                                        <slot name="subtitle" :account="account" :user="user">
                                            {{ user.email }}
                                        </slot>
                                    </v-list-item-subtitle>
                                </v-scale-transition>
                            </v-list-item-content>

                            <!-- Upload Profile Image -->
                            <v-list-item-action v-if="account">
                                <k-upload :inline="false"
                                          :endpoint="uploadUserImageEndpoint"
                                          :allowed-file-types="allowedFileTypes"
                                          @complete="$uploader.refreshAccount()"
                                >
                                    <template v-slot:default="{inline, open}">
                                        <v-tooltip left eager v-if="!inline">
                                            <template v-slot:activator="{on}">
                                                <v-btn
                                                        v-on="on"
                                                        outlined
                                                        small
                                                        fab
                                                        :color="$color('primary', '')"
                                                        ripple
                                                        icon
                                                        @click="open">
                                                    <v-icon>camera_alt</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>{{ $t('views.settings.upload-profile-image') }}</span>
                                        </v-tooltip>
                                    </template>
                                </k-upload>
                            </v-list-item-action>

                            <!-- Logout action -->
                            <v-list-item-action>
                                <v-tooltip left eager>
                                    <template v-slot:activator="{on}">
                                        <v-btn
                                                v-on="on"
                                                outlined
                                                small
                                                fab
                                                :color="$color('primary lighten-3', '')"
                                                ripple
                                                icon
                                                :loading="$store.state.auth && $store.state.auth.logoutPending"
                                                @click="$store.dispatch('auth/logout', $router.currentRoute.fullPath)">
                                            <v-icon>exit_to_app</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>{{ $t('logout') }}</span>
                                </v-tooltip>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </v-card>

                <v-subheader :class="$classes('mt-4 primary--text', 'text--lighten-3')">
                    {{ $t('views.settings.general') }}
                </v-subheader>
                <v-card flat>
                    <v-list>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>{{ $t('views.settings.language') }}</v-list-item-title>
                            </v-list-item-content>

                            <v-list-item-action>
                                <v-menu eager>
                                    <template v-slot:activator="{on}">
                                        <div class="menu-activator" v-on="on">
                                            <span>{{ selectedLanguage }}</span>
                                            <v-icon>arrow_drop_down</v-icon>
                                        </div>
                                    </template>

                                    <v-list>
                                        <v-list-item
                                                v-for="available in languageAvailables"
                                                :key="available.code"
                                                @click="$store.commit('i18n/setLocale', available.code)"
                                        >
                                            <v-list-item-content>
                                                <v-list-item-title v-text="available.label"></v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </v-list-item-action>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>{{ $t('dark-mode') }}</v-list-item-title>
                            </v-list-item-content>

                            <v-list-item-action>
                                <v-switch hide-details v-model="darkMode" :color="$color('primary', 'primary lighten-3')"></v-switch>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </v-card>

                <!-- Organization Info -->
                <organization-settings class="mt-5"></organization-settings>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import {MetaInfo} from 'vue-meta';
    import {Component, Vue} from 'vue-property-decorator';
    import {User} from '../stores/account/User';
    import {AccountState} from '../stores/account/AccountState';
    import OrganizationSettings from './settings/OrganizationSettings.vue';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component({
        components: {
            OrganizationSettings,
        },
    })
    export default class UserSettings extends Vue {
        public languageAvailables: LanguageAvailable[] = [];

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

        public get selectedLanguage(): string {
            let language = this.$store.state.i18n.locale;
            language = this.$i18n.messages[language] ? language : this.$store.state.i18n.fallback;

            return this.$t('languages.' + language) as string;
        }

        public get darkMode(): boolean {
            return this.$store.state.darkMode.enabled;
        }

        public set darkMode(value: boolean) {
            this.$store.commit('darkMode/toggle', value);
        }

        public get account(): AccountState|undefined {
            return this.$store && this.$store.state.account && this.$store.state.account
                ? this.$store.state.account
                : undefined;
        }

        public get user(): User|undefined {
            return this.account && this.account.user ? this.account.user : undefined;
        }

        public get allowedFileTypes(): string[] {
            return ['image/*', '.jpg', '.jpeg', '.png', '.tif', '.tiff', '.gif', '.svg', '.webp'];
        }

        public get uploadUserImageEndpoint(): string {
            return this.$api.getBaseUrl() + '/profile/upload';
        }
    }

    interface LanguageAvailable {
        code: string;
        label: string;
    }
</script>
