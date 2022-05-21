<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-list
        rounded
    >
        <!-- Mini Header -->
        <div
            v-if="mini"
        >
            <v-list-item
                :id="'orgSwitcherHeader_' + self._uid"
            >
                <v-btn
                    v-if="hasRetryRequired"
                    key="retry"
                    fab
                    width="50"
                    height="50"
                    text
                    color="red"
                    rounded
                    ripple
                    :loading="loading"
                    @click.stop="retry"
                >
                    <v-icon>
                        refresh
                    </v-icon>
                </v-btn>

                <v-avatar
                    v-else-if="hasOrgBadge"
                    key="orgBadge"
                    size="50"
                    :color="badgeBackgroundColor"
                    @click.stop="self.$store.commit('account/toggleOrganizationSwitcher')"
                >
                    <k-img
                        :api-src="badgeUrl"
                        :key="badgeUrl"
                        mode="cover"
                        transition="fade-transition"
                    ></k-img>
                </v-avatar>

                <v-avatar
                    v-else-if="mini"
                    key="appBadge"
                    tile
                    size="50"
                    @click.stop="self.$store.commit('account/toggleOrganizationSwitcher')"
                >
                    <v-img
                        :src="appBadge"
                        contain
                    ></v-img>
                </v-avatar>

                <v-tooltip
                    :activator="'#orgSwitcherHeader_' + _uid"
                    right
                    :disabled="miniBadgeTooltipDisabled"
                    open-delay="120"
                    nudge-right="8"
                    transition="slide-x-transition"
                    :color="self.$store.state.darkMode.enabled ? 'primary lighten-2' : 'primary lighten-1'"
                >
                    <span>
                        {{ title }}
                    </span>
                </v-tooltip>
            </v-list-item>

            <v-list-item>
                <v-btn
                    icon
                    color="blue-grey"
                    @click="$emit('click-mini-drawer')"
                >
                    <v-icon
                        small
                    >
                        fa-fw fa-chevron-right
                    </v-icon>
                </v-btn>
            </v-list-item>
        </div>

        <!-- Full Header -->
        <v-list-item
            v-if="!mini"
        >
            <v-row
                class="mt-0 mb-0"
                align="center"
            >
                <v-col
                    cols="3"
                ></v-col>

                <v-col
                    cols="6"
                    class="d-flex justify-center"
                >
                    <v-avatar
                        v-if="hasOrgBadge"
                        key="orgBadge"
                        size="76"
                        :color="badgeBackgroundColor"
                        @click.stop="self.$store.commit('account/toggleOrganizationSwitcher')"
                    >
                        <k-img
                            :api-src="hasOrgBadge ? self.$store.state.account.organizationInfo.imageUrl : undefined"
                            :key="hasOrgBadge ? self.$store.state.account.organizationInfo.imageUrl : undefined"
                            mode="cover"
                            transition="fade-transition"
                        ></k-img>
                    </v-avatar>

                    <v-avatar
                        v-else
                        key="appBadge"
                        tile
                        size="76"
                        @click.stop="self.$store.commit('account/toggleOrganizationSwitcher')"
                    >
                        <v-img
                            :src="appBadge"
                            contain
                        ></v-img>
                    </v-avatar>
                </v-col>

                <v-col
                    cols="3"
                >
                    <v-btn
                        icon
                        color="blue-grey"
                        @click="$emit('click-mini-drawer')"
                    >
                        <v-icon
                            x-small
                        >
                            fa-fw fa-chevron-left
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-list-item>

        <v-list-item
            v-if="!mini"
            class="pl-0 pr-0 justify-center"
            dense
        >
            <v-btn
                v-if="hasRetryRequired"
                key="retry"
                text
                color="red"
                rounded
                ripple
                :loading="loading"
                @click="retry"
            >
                <v-icon>
                    refresh
                </v-icon>
            </v-btn>

            <v-btn
                v-else
                :key="title"
                text
                rounded
                ripple
                small
                :loading="loading"
                @click="self.$store.commit('account/toggleOrganizationSwitcher')"
            >
                <span
                    style="max-width: 170px; overflow: hidden; text-overflow: ellipsis;"
                >
                    {{ title }}
                </span>

                <v-icon
                    class="ml-1"
                    x-small
                >
                    fa-fw fa-angle-double-right
                </v-icon>
            </v-btn>
        </v-list-item>
    </v-list>
</template>

<script lang="ts">
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
</script>
