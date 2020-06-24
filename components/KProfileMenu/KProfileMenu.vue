<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-menu
            v-model="menu"
            :disabled="!user"
            :close-on-content-click="false"
            min-width="300"
            max-width="90%"
            max-height="90%"
            transition="slide-x-reverse-transition"
    >
        <template v-slot:activator="{on, attrs}">
            <v-btn v-on="on"
                   v-bind="attrs"
                   color="primary"
                   depressed
                   fab
                   small
                   :loading="pending"
            >
                <v-fade-transition mode="out-in">
                    <span class="text-h6" v-if="user">
                        {{ initial }}
                    </span>
                    <v-icon v-else small>fa fa-user</v-icon>
                </v-fade-transition>
            </v-btn>
        </template>

        <v-card>
            <v-list v-if="!!user">
                <v-list-item two-line>
                    <v-list-item-avatar>
                        <slot name="avatar" :account="account" :user="user">
                            <v-avatar color="accent">
                                <v-scale-transition mode="out-in">
                                    <span class="white--text text-h6" v-if="user">
                                        {{ initial }}
                                    </span>
                                    <v-icon v-else small dark>fa fa-user</v-icon>
                                </v-scale-transition>
                            </v-avatar>
                        </slot>
                    </v-list-item-avatar>

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
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="logout">{{ $t('logout') }}</v-btn>
                </slot>
            </v-card-actions>
        </v-card>
    </v-menu>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {AccountState} from '../../stores/account/AccountState';
    import {User} from '../../stores/account/User';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KProfileMenu extends Vue {
        private menu: boolean = false;

        public get account(): AccountState|undefined {
            return this.$store && this.$store.state.account && this.$store.state.account
                ? this.$store.state.account
                : undefined;
        }

        public get user(): User|undefined {
            return this.account && this.account.user ? this.account.user : undefined;
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
                await this.$store.dispatch('auth/logout')
            }
        }
    }
</script>
