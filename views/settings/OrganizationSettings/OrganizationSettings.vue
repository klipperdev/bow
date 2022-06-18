<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div
        v-if="organization"
    >
        <v-subheader
            :class="$classes('primary--text', 'text--lighten-2')"
        >
            {{ $t('views.settings.organization-account') }}
        </v-subheader>

        <v-card>
            <v-list
                two-line
            >
                <v-list-item>
                    <!-- Organization Image -->
                    <v-list-item-avatar
                        :color="imageBackgroundColor"
                    >
                        <k-img
                            v-if="organization && organization.imageUrl"
                            :api-src="organization.imageUrl"
                            mode="cover"
                        >
                            <template v-slot:default="{loaded}">
                                <v-row
                                    v-if="!loaded"
                                    class="fill-height ma-0"
                                    align="center"
                                    justify="center"
                                >
                                    <span
                                        class="white--text text-h6"
                                    >
                                        {{ $oc(organization).initial() }}
                                    </span>
                                </v-row>
                            </template>
                        </k-img>

                        <v-icon
                            v-else
                            dark
                        >
                            fa-fw fa-building
                        </v-icon>
                    </v-list-item-avatar>

                    <!-- Organization Info -->
                    <v-list-item-content>
                        <v-list-item-title
                            class="font-weight-bold"
                        >
                            {{ $oc(organization).label() }}
                        </v-list-item-title>

                        <v-list-item-subtitle>
                            {{ $oc(organization).name() }}
                        </v-list-item-subtitle>
                    </v-list-item-content>

                    <!-- Upload Organization Image -->
                    <v-list-item-action
                        v-if="account"
                    >
                        <k-upload
                            :inline="false"
                            :endpoint="uploadOrganizationImageEndpoint"
                            :allowed-file-types="allowedFileTypes"
                            @complete="$uploader.refreshAccount(true)"
                        >
                            <template v-slot:default="{inline, open}">
                                <v-btn
                                    :id="'uploadOrganizationImage_' + _uid"
                                    outlined
                                    small
                                    fab
                                    color="primary"
                                    ripple
                                    icon
                                    @click="open"
                                >
                                    <v-icon>
                                        camera_alt
                                    </v-icon>

                                    <v-tooltip
                                        v-if="!inline"
                                        :activator="'#uploadOrganizationImage_' + _uid"
                                        left
                                    >
                                        <span>
                                            {{ $t('views.settings.upload-organization-image') }}
                                        </span>
                                    </v-tooltip>
                                </v-btn>
                            </template>
                        </k-upload>
                    </v-list-item-action>
                </v-list-item>
            </v-list>

            <organization-settings-details
                class="mt-3"
            />
        </v-card>
    </div>
</template>

<script lang="ts">
import {AccountState} from '@klipper/bow/stores/account/AccountState';
import {Organization} from '@klipper/bow/stores/account/Organization';
import OrganizationSettingsDetails from '@klipper/bow/views/settings/OrganizationSettingsDetails/OrganizationSettingsDetails.vue';
import {Component, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    components: {
        OrganizationSettingsDetails,
    },
})
export default class OrganizationSettings extends Vue {
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
</script>
