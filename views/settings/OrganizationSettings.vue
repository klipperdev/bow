<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-fade-transition mode="out-in">
        <div v-if="organization">
            <v-subheader :class="$classes('primary--text', 'text--lighten-3')">
                {{ $t('views.settings.organization-account') }}
            </v-subheader>
            <v-card flat>
                <v-list two-line>
                    <v-list-item>
                        <!-- Organization Image -->
                        <v-list-item-avatar :color="imageBackgroundColor">
                            <v-fade-transition mode="out-in">
                                <k-img v-if="organization && organization.imageUrl"
                                       :api-src="organization.imageUrl"
                                       mode="cover"
                                >
                                    <template v-slot:default="{loaded}">
                                        <v-row v-if="!loaded"
                                               class="fill-height ma-0"
                                               align="center"
                                               justify="center"
                                        >
                                        <span class="white--text text-h6">
                                            {{ organization.initial }}
                                        </span>
                                        </v-row>
                                    </template>
                                </k-img>

                                <v-icon v-else dark>fa fa-fw fa-building</v-icon>
                            </v-fade-transition>
                        </v-list-item-avatar>

                        <!-- Organization Info -->
                        <v-list-item-content>
                            <v-list-item-title class="font-weight-bold">
                                {{ organization.label }}
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                {{ organization.name }}
                            </v-list-item-subtitle>
                        </v-list-item-content>

                        <!-- Upload Organization Image -->
                        <v-list-item-action v-if="account">
                            <k-upload :inline="false"
                                      :endpoint="uploadOrganizationImageEndpoint"
                                      :allowed-file-types="allowedFileTypes"
                                      @complete="$uploader.refreshAccount(true)"
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
                                        <span>{{ $t('views.settings.upload-organization-image') }}</span>
                                    </v-tooltip>
                                </template>
                            </k-upload>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>

                <organization-settings-details class="mt-3"></organization-settings-details>
            </v-card>
        </div>
    </v-fade-transition>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Organization} from '../../stores/account/Organization';
    import {AccountState} from '../../stores/account/AccountState';
    import OrganizationSettingsDetails from './OrganizationSettingsDetails.vue';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component({
        components: {
            OrganizationSettingsDetails,
        },
    })
    export default class OrganizationSettings extends Vue {
        public get account(): AccountState|undefined {
            return this.$store && this.$store.state.account && this.$store.state.account
                ? this.$store.state.account
                : undefined;
        }

        public get organization(): Organization|undefined {
            return this.account && this.account.organizationInfo ? this.account.organizationInfo : undefined;
        }

        public get imageBackgroundColor(): string {
            return this.organization && this.organization.imageUrl
                ? (this.$store.state.darkMode.enabled ? 'white' : '')
                : 'primary';
        }

        public get allowedFileTypes(): string[] {
            return ['image/*', '.jpg', '.jpeg', '.png', '.tif', '.tiff', '.gif', '.svg', '.webp'];
        }

        public get uploadOrganizationImageEndpoint(): string {
            return this.$api.getBaseUrl() + '/' + this.$store.state.account.organization + '/organization/upload';
        }
    }
</script>
