<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-btn :id="'profileMenuBtn_' + _uid"
           v-bind="$attrs"
           color="primary"
           depressed
           fab
           small
           :loading="pending"
           @click="retry()"
    >
        <v-avatar size="42">
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
                                        {{ initial }}
                                    </span>
                        </v-row>
                    </template>
                </k-img>

                <span class="text-h6" v-else-if="user">
                            {{ initial }}
                        </span>
                <v-icon v-else small>fa fa-fw fa-user</v-icon>
            </v-fade-transition>
        </v-avatar>

        <v-menu :activator="'#profileMenuBtn_' + _uid"
                v-model="menu"
                v-if="!disabled"
                :close-on-content-click="false"
                min-width="300"
                max-width="90%"
                max-height="90%"
                transition="scale-transition"
                origin="top right"
        >
            <v-card>
                <v-list v-if="!!user">
                    <v-list-item>
                        <v-list-item-icon>
                            <slot name="avatar" :account="account" :user="user">
                                <v-avatar color="accent" size="72">
                                    <v-scale-transition mode="out-in">
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
                                                    <span class="white--text text-h4">
                                                        {{ initial }}
                                                    </span>
                                                </v-row>
                                            </template>
                                        </k-img>

                                        <span class="white--text text-h6" v-else-if="user">
                                            {{ initial }}
                                        </span>
                                        <v-icon v-else small dark>fa fa-fw fa-user</v-icon>
                                    </v-scale-transition>
                                </v-avatar>
                            </slot>
                        </v-list-item-icon>

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
                    </v-list-item>
                </v-list>

                <v-divider></v-divider>

                <v-card-actions>
                    <slot name="actions" :account="account" :user="user">
                        <v-btn :id="'profileMenuToggleBtn_' + _uid"
                               text
                               @click="$store.commit('darkMode/toggle')"
                        >
                            <v-scale-transition mode="out-in" origin="center center">
                                <v-icon v-if="$store.state.darkMode.enabled"
                                        key="light"
                                        color="amber lighten-2"
                                >
                                    fa fa-fw fa-sun
                                </v-icon>
                                <v-icon v-else
                                        key="dark"
                                        color="deep-purple darken-2"
                                >
                                    fa fa-fw fa-moon
                                </v-icon>
                            </v-scale-transition>

                            <v-tooltip :activator="'#profileMenuToggleBtn_' + _uid" eager right open-delay="600">
                                <span>{{ $t($store.state.darkMode.enabled ? 'light-mode' : 'dark-mode') }}</span>
                            </v-tooltip>
                        </v-btn>

                        <v-spacer></v-spacer>
                        <v-btn :color="$store.state.darkMode.enabled ? 'primary lighten-3' : 'primary'"
                               text
                               @click="logout"
                        >
                            {{ $t('logout') }}
                        </v-btn>
                    </slot>
                </v-card-actions>
            </v-card>
        </v-menu>
    </v-btn>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {AccountState} from '@klipper/bow/stores/account/AccountState';
    import {User} from '@klipper/bow/stores/account/User';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KProfileMenu extends Vue {
        private menu: boolean = false;

        private disabled: boolean = true;

        public get account(): AccountState|undefined {
            return this.$store && this.$store.state.account
                ? this.$store.state.account
                : undefined;
        }

        public get user(): User|undefined {
            return this.account && this.account.user ? this.account.user : undefined;
        }

        @Watch('user')
        public watchUser(value): void {
            this.disabled = !value;
        }

        public get initial(): string {
            return this.user ? this.account.user.initial : '';
        }

        public get pending(): boolean {
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

        public async logout(): Promise<void> {
            this.menu = false;

            if (this.$store && this.$store.state.auth) {
                await this.$store.dispatch('auth/logout');
            }
        }

        public async retry(): Promise<void> {
            if (!this.user) {
                await this.$store.dispatch('account/initialize');
            }
        }
    }
</script>
