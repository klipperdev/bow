<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-form ref="form" @submit.prevent>
        <v-row class="ma-0" align="center">
            <v-col cols="10" class="ma-0 pa-0">
                <v-subheader :class="$classes('primary--text', 'text--lighten-3')">
                    {{ $t('details') }}
                </v-subheader>
            </v-col>

            <v-col cols="2" class="text-right">
                <v-btn :id="'userSettingsEditBtn_' + _uid"
                       :color="$color('primary', 'primary lighten-2')"
                       outlined
                       fab
                       icon
                       ripple
                       rounded
                       x-small
                       :disabled="editMode"
                       @click="editMode = !editMode"
                >
                    <v-icon>edit</v-icon>

                    <v-tooltip :activator="'#userSettingsEditBtn_' + _uid" left>
                        <span>{{ $t('edit') }}</span>
                    </v-tooltip>
                </v-btn>
            </v-col>
        </v-row>

        <v-container class="pt-0 pb-0">
            <v-alert type="error"
                     class="ma-1"
                     transition="slide-y-reverse-transition"
                     mode="out-in"
                     :value="editMode && showFormAlert">
                {{ formAlert }}
            </v-alert>

            <v-row>
                <k-col-label vertical :edit-mode="editMode" edit-label-required :label="$t('model.user.fields.username')">
                    <template v-slot:view>
                        {{ $oc(user).username('~') }}
                    </template>

                    <template v-slot:edit>
                        <v-text-field type="text"
                                      outlined
                                      v-model="username"
                                      autofocus
                                      :error-messages="fieldErrors('username')"
                                      @keydown.enter="save"
                                      :disabled="loading"
                                      :rules="[$r('required')]"
                        ></v-text-field>
                    </template>
                </k-col-label>

                <k-col-label vertical :edit-mode="editMode" edit-label-required :label="$t('model.user.fields.email')">
                    <template v-slot:view>
                        {{ $oc(user).email('~') }}
                    </template>

                    <template v-slot:edit>
                        <v-text-field type="text"
                                      outlined
                                      v-model="email"
                                      :error-messages="fieldErrors('email')"
                                      @keydown.enter="save"
                                      :disabled="loading"
                                      :rules="[$r('required'), $r('email')]"
                        ></v-text-field>
                    </template>
                </k-col-label>
            </v-row>
        </v-container>

        <v-fade-transition mode="out-in">
            <v-card-actions v-if="editMode" class="pt-0 text-center">
                <v-spacer></v-spacer>
                <v-btn small text @click="cancel">
                    {{ $t('cancel')}}
                </v-btn>
                <v-btn small depressed color="primary" :loading="loading" @click="save">
                    {{ $t('save')}}
                </v-btn>
            </v-card-actions>
        </v-fade-transition>
    </v-form>
</template>

<script lang="ts">
    import {Component, Watch} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {Canceler} from '@klipper/http-client/Canceler';
    import {User} from '@klipper/bow/stores/account/User';
    import {AccountState} from '@klipper/bow/stores/account/AccountState';
    import {AjaxFormContent} from '@klipper/bow/mixins/http/AjaxFormContent';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class UserSettings extends mixins(AjaxFormContent) {
        public username: string|null = null;

        public email: string|null = null;

        private editMode: boolean = false;

        public get account(): AccountState|undefined {
            return this.$store && this.$store.state.account && this.$store.state.account
                ? this.$store.state.account
                : undefined;
        }

        public get user(): User|undefined {
            return this.account && this.account.user ? this.account.user : undefined;
        }

        @Watch('editMode')
        public watchEditMode(): void {
            this.username = this.user ? this.user.username : null;
            this.email = this.user ? this.user.email : null;
        }

        public cancel(): void {
            this.editMode = false;
        }

        public async save(): Promise<void> {
            if (this.isValidForm()) {
                const res = await this.fetchData<Record<string, any>>(async (canceler: Canceler): Promise<Record<string, any>|null> => {
                    return await this.$api.request( {
                        url: '/user',
                        method: 'PATCH',
                        data: {
                            username: this.username,
                            email: this.email,
                        },
                    }, canceler);
                }, false);

                if (res) {
                    const logoutRequired = this.user ? this.user.username !== res.username : false;
                    this.$store.commit('account/refreshUserSuccess', {
                        id: res.id,
                        username: res.username || null,
                        email: res.email || null,
                        lastName: res.last_name || null,
                        firstName: res.first_name || null,
                        fullName: res.full_name || null,
                        initial: res.initial || null,
                        imageUrl: res.image_url || null,
                    } as User);

                    this.editMode = false;
                    this.loading = false;

                    if (logoutRequired) {
                        await this.$store.dispatch('auth/logout', false);
                    }
                }
            }
        }
    }
</script>
