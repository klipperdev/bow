<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-list rounded>
        <!-- Mini Header -->
        <div v-if="mini">
            <v-list-item :id="'orgSwitcherHeader_' + _uid">
                <v-scale-transition mode="out-in" origin="center center">
                    <v-btn v-if="hasRetryRequired"
                           key="retry"
                           fab
                           width="50"
                           height="50"
                           text
                           color="red"
                           rounded
                           ripple
                           :loading="$store.state.account.organizationPending || !$store.state.account.initialized"
                           @click.stop="retry"
                    >
                        <v-icon>refresh</v-icon>
                    </v-btn>

                    <v-avatar v-else-if="hasOrgBadge"
                              size="50"
                              :color="badgeBackgroundColor"
                              @click.stop="$store.commit('account/toggleOrganizationSwitcher')"
                              key="orgBadge"
                    >
                        <k-img :api-src="hasOrgBadge ? $store.state.account.organizationInfo.imageUrl : undefined"
                               mode="cover"
                               transition="fade-transition"
                        ></k-img>
                    </v-avatar>

                    <v-avatar v-else-if="mini"
                              tile
                              size="50"
                              @click.stop="$store.commit('account/toggleOrganizationSwitcher')"
                              key="appBadge"
                    >
                        <v-img :src="appBadge"
                               contain
                        ></v-img>
                    </v-avatar>
                </v-scale-transition>

                <v-tooltip :activator="'#orgSwitcherHeader_' + _uid"
                           right
                           :disabled="miniBadgeTooltipDisabled"
                           open-delay="120"
                           nudge-right="8"
                           eager
                           transition="slide-x-transition"
                           :color="$store.state.darkMode.enabled ? 'primary lighten-2' : 'primary lighten-1'"
                >
                    <span>{{ title }}</span>
                </v-tooltip>
            </v-list-item>

            <v-list-item>
                <v-btn icon @click="$emit('click-mini-drawer')">
                    <v-icon small>fa fa-fw fa-chevron-right</v-icon>
                </v-btn>
            </v-list-item>
        </div>

        <!-- Full Header -->
        <v-list-item v-if="!mini">
            <v-row class="mt-0 mb-0" align="center">
                <v-col cols="3"></v-col>

                <v-col cols="6" class="d-flex justify-center">
                    <v-scale-transition mode="out-in" origin="center center">
                        <v-avatar v-if="hasOrgBadge"
                                  size="76"
                                  :color="badgeBackgroundColor"
                                  @click.stop="$store.commit('account/toggleOrganizationSwitcher')"
                                  key="orgBadge"
                        >
                            <k-img :api-src="hasOrgBadge ? $store.state.account.organizationInfo.imageUrl : undefined"
                                   mode="cover"
                                   transition="fade-transition"
                            ></k-img>
                        </v-avatar>

                        <v-avatar v-else
                                  tile
                                  size="76"
                                  @click.stop="$store.commit('account/toggleOrganizationSwitcher')"
                                  key="appBadge"
                        >
                            <v-img :src="appBadge"
                                   contain
                            ></v-img>
                        </v-avatar>
                    </v-scale-transition>
                </v-col>

                <v-col cols="3">
                    <v-btn depressed icon @click="$emit('click-mini-drawer')">
                        <v-icon small>fa fa-fw fa-chevron-left</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-list-item>

        <v-list-item dense class="pl-0 pr-0 justify-center" v-if="!mini">
            <v-fade-transition mode="out-in">
                <v-btn v-if="hasRetryRequired"
                       key="retry"
                       text
                       color="red"
                       rounded
                       ripple
                       :loading="$store.state.account.organizationPending || !$store.state.account.initialized"
                       @click="retry"
                >
                    <v-icon>refresh</v-icon>
                </v-btn>

                <v-btn v-else
                       :key="title"
                       text
                       rounded
                       ripple
                       small
                       :loading="$store.state.account.organizationPending || !$store.state.account.initialized"
                       @click="$store.commit('account/toggleOrganizationSwitcher')"
                >
                    <span style="max-width: 170px; overflow: hidden; text-overflow: ellipsis;">
                        {{ title }}
                    </span>
                    <v-icon x-small class="ml-1">fa fa-fw fa-angle-double-right</v-icon>
                </v-btn>
            </v-fade-transition>
        </v-list-item>
    </v-list>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KOrgSwitcherHeader extends Vue {
        @Prop({type: Boolean, default: false})
        public mini: boolean;

        private miniBadgeTooltipDisabled: boolean = false;

        public get useBackgroundInBadge(): boolean {
            return this.hasOrgBadge && this.$store.state.darkMode.enabled;
        }

        public get badgeBackgroundColor(): string {
            return this.useBackgroundInBadge ? 'white' : '';
        }

        public get hasOrgBadge(): boolean {
            return this.$store.getters['account/hasOrganizationImage'];
        }

        public get appBadge(): string {
            return this.$store.state.darkMode.enabled ? this.$klipper.badgeDark : this.$klipper.badgeLight;
        }

        public get badgeUrl(): string|undefined {
            return this.hasOrgBadge ? this.$store.state.account.organizationInfo.imageUrl : '';
        }

        public get hasRetryRequired(): boolean {
            return this.$store.state.account.organizationError
                || (!this.$store.state.account.user && !this.$store.state.account.initializationPending);
        }

        public get isOrganizationSwitcherOpened(): boolean {
            return this.$store.state.account.organizationSwitcherOpen;
        }

        public get title(): string {
            if (this.$store.getters['account/hasOrganizationInfo']) {
                return this.$store.state.account.organizationInfo.label;
            }

            return this.$klipper.allowUserContext && !!this.$store.state.account.user
                ? this.$store.state.account.user.fullName
                : this.$klipper.name;
        }

        public mounted(): void {
            this.watchIsOrganizationSwitcherOpened(this.isOrganizationSwitcherOpened);
        }

        @Watch('isOrganizationSwitcherOpened')
        public watchIsOrganizationSwitcherOpened(value: boolean): void {
            this.miniBadgeTooltipDisabled = value;
        }

        public async retry(): Promise<void> {
            if (!this.$store.state.account.user) {
                await this.$store.dispatch('account/initialize');
            } else {
                await this.$store.dispatch('account/refreshOrganizationInfo');
            }
        }
    }
</script>
