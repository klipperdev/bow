<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-container
        fill-height
    >
        <v-row
            justify="center"
            align-content="center"
        >
            <v-col
                cols="12"
                sm="8"
                md="6"
                lg="5"
                xl="3"
            >
                <div
                    class="text-center"
                >
                    <v-avatar
                        size="140"
                        tile
                    >
                        <div>
                            <v-img
                                :src="badge"
                                width="100px"
                                height="100px"
                            />
                        </div>
                    </v-avatar>
                </div>

                <h1
                    :class="self.$classes('pb-4 text-center primary--text', 'text--lighten-3')"
                >
                    {{ appName }}
                </h1>

                <v-card
                    class="pb-2"
                >
                    <v-card-title>
                        <div
                            :class="self.$classes('headline primary--text', 'text--lighten-3')"
                        >
                            {{ $t('views.login.title') }}
                        </div>
                    </v-card-title>

                    <v-card-text
                        class="pb-0"
                    >
                        <v-alert
                            type="error"
                            class="mt-3 mb-4"
                            :value="showFormAlert"
                        >
                            {{ formAlert }}
                        </v-alert>

                        <v-form
                            ref="form"
                            @submit.prevent=""
                        >
                            <v-text-field
                                type="text"
                                :label="self.$t('views.login.username')"
                                v-model="username"
                                @keydown.enter="login"
                                filled
                                clearable
                                autofocus
                                :disabled="pending"
                                :rules="[self.$r('required')]"
                            />

                            <v-text-field
                                :label="self.$t('views.login.password')"
                                v-model="password"
                                :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                                :type="showPassword ? 'text' : 'password'"
                                @click:append="showPassword = !showPassword"
                                @keydown.enter="login"
                                filled
                                clearable
                                :disabled="pending"
                                :rules="[self.$r('required')]"
                            />
                        </v-form>
                    </v-card-text>

                    <v-card-actions>
                        <v-btn
                            color="primary"
                            depressed
                            raised
                            ripple
                            block
                            rounded
                            :loading="pending"
                            :disabled="pending"
                            @click="login"
                        >
                            {{$t('views.login.title')}}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
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
            } catch (e: any) {
                this.formAlert = getRequestErrorMessage(this, e);
            }
        }
    }
}
</script>
