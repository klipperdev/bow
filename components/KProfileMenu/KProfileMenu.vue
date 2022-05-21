<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-btn
        :id="'profileMenuBtn_' + self._uid"
        v-bind="$attrs"
        color="accent"
        depressed
        fab
        small
        :loading="pending"
        @click="retry()"
    >
        <v-avatar
            size="42"
        >
            <k-img
                v-if="user && user.imageUrl"
                :api-src="user.imageUrl"
                :key="user.imageUrl"
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
                            {{ initial }}
                        </span>
                    </v-row>
                </template>
            </k-img>

            <span
                v-else-if="user"
                class="text-h6"
            >
                {{ initial }}
            </span>

            <v-icon
                v-else
                small
            >
                fa-fw fa-user
            </v-icon>
        </v-avatar>

        <v-menu
            v-if="!disabled"
            :activator="'#profileMenuBtn_' + self._uid"
            v-model="menu"
            :close-on-content-click="false"
            min-width="300"
            max-width="90%"
            max-height="90%"
            transition="slide-y-transition"
            origin="top right"
        >
            <v-card>
                <v-list
                    v-if="!!user"
                >
                    <v-list-item>
                        <v-list-item-icon>
                            <slot
                                name="avatar"
                                :account="account"
                                :user="user"
                            >
                                <v-avatar
                                    color="accent"
                                    size="72"
                                >
                                    <k-img
                                        v-if="user && user.imageUrl"
                                        :api-src="user.imageUrl"
                                        :key="user.imageUrl"
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
                                                    class="white--text text-h4"
                                                >
                                                    {{ initial }}
                                                </span>
                                            </v-row>
                                        </template>
                                    </k-img>

                                    <span
                                        v-else-if="user"
                                        class="white--text text-h6"
                                    >
                                        {{ initial }}
                                    </span>

                                    <v-icon
                                        v-else
                                        small
                                        dark
                                    >
                                        fa-fw fa-user
                                    </v-icon>
                                </v-avatar>
                            </slot>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title
                                class="font-weight-bold"
                            >
                                <slot
                                    name="title"
                                    :account="account" :user="user"
                                >
                                    {{ user.fullName || user.email }}
                                </slot>
                            </v-list-item-title>

                            <v-list-item-subtitle
                                v-if="!!user.fullName"
                            >
                                <slot
                                    name="subtitle"
                                    :account="account"
                                    :user="user"
                                >
                                    {{ user.email }}
                                </slot>
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>

                <v-divider />

                <v-card-actions>
                    <slot
                        name="actions"
                        :account="account"
                        :user="user"
                    >
                        <v-btn
                            :id="'profileMenuToggleBtn_' + self._uid"
                            text
                            @click="self.$store.commit('darkMode/toggle')"
                        >
                            <v-icon
                                v-if="self.$store.state.darkMode.enabled"
                                key="light"
                                color="amber lighten-2"
                            >
                                fa-fw fa-sun
                            </v-icon>

                            <v-icon
                                v-else
                                key="dark"
                                color="deep-purple darken-2"
                            >
                                fa-fw fa-moon
                            </v-icon>

                            <v-tooltip
                                :activator="'#profileMenuToggleBtn_' + self._uid"
                                right
                                open-delay="600"
                            >
                                <span>
                                    {{ $t($store.state.darkMode.enabled ? 'light-mode' : 'dark-mode') }}
                                </span>
                            </v-tooltip>
                        </v-btn>

                        <v-spacer />

                        <v-btn
                            color="primary"
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
import {Selfable} from '@klipper/bow/mixins/Selfable';
import {AccountState} from '@klipper/bow/stores/account/AccountState';
import {User} from '@klipper/bow/stores/account/User';
import {mixins} from 'vue-class-component';
import {Component, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KProfileMenu extends mixins(
    Selfable,
) {
    private menu: boolean = false;

    private disabled: boolean = true;

    private get account(): AccountState|undefined {
        return this.$store && this.$store.state.account
            ? this.$store.state.account
            : undefined;
    }

    private get user(): User|undefined {
        return this.account && this.account.user ? this.account.user : undefined;
    }

    public mounted(): void {
        this.watchUser(!!this.user);
    }

    @Watch('user')
    public watchUser(value: boolean): void {
        this.disabled = !value;
    }

    private get initial(): string {
        return this.user && this.account && this.account.user ? this.account.user.initial : '';
    }

    private get pending(): boolean {
        if (this.$store) {
            const accountPending = this.$store.state.account
                ? !this.$store.state.account.user && this.$store.state.account.initializationPending
                : false;
            const authPending = this.$store.state.auth
                ? !this.$store.state.auth.authenticated && this.$store.state.auth.authenticationPending
                : false;
            const logoutPending = this.$store.state.auth
                ? this.$store.state.auth.logoutPending
                : false;

            return accountPending || authPending || logoutPending;
        }

        return false;
    }

    private async logout(): Promise<void> {
        this.menu = false;

        if (this.$store && this.$store.state.auth) {
            await this.$store.dispatch('auth/logout');
        }
    }

    private async retry(): Promise<void> {
        if (!this.user) {
            await this.$store.dispatch('account/initialize');
        }
    }
}
</script>
