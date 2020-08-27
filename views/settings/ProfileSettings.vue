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
                    {{ $t('model.profile.label') }}
                </v-subheader>
            </v-col>

            <v-col cols="2" class="text-right">
                <v-tooltip left eager>
                    <template v-slot:activator="{on}">
                        <v-btn v-on="on"
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
                        </v-btn>
                    </template>
                    <span>{{ $t('edit') }}</span>
                </v-tooltip>
            </v-col>
        </v-row>

        <v-card flat>
            <v-container class="pt-0 pb-0">
                <v-alert type="error"
                         class="ma-1"
                         transition="slide-y-reverse-transition"
                         mode="out-in"
                         :value="editMode && showFormAlert">
                    {{ formAlert }}
                </v-alert>

                <v-row>
                    <k-col-label vertical :edit-mode="editMode" :label="$mfl('user', 'first_name')">
                        <template v-slot:view>
                            {{ user.firstName }}
                        </template>

                        <template v-slot:edit>
                            <v-text-field type="text"
                                          outlined
                                          v-model="firstName"
                                          autofocus
                                          :error-messages="fieldErrors('first_name')"
                                          @keydown.enter="save"
                                          :disabled="loading"
                                          :rules="[$r('required')]"
                            ></v-text-field>
                        </template>
                    </k-col-label>

                    <k-col-label vertical :edit-mode="editMode" :label="$mfl('user', 'last_name')">
                        <template v-slot:view>
                            {{ user.lastName }}
                        </template>

                        <template v-slot:edit>
                            <v-text-field type="text"
                                          outlined
                                          v-model="lastName"
                                          :error-messages="fieldErrors('last_name')"
                                          @keydown.enter="save"
                                          :disabled="loading"
                                          :rules="[$r('required')]"
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
        </v-card>
    </v-form>
</template>

<script lang="ts">
    import {Component, Watch} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {MapKey} from '@klipper/http-client/models/MapKey';
    import {Canceler} from '@klipper/http-client/Canceler';
    import {User} from '@klipper/bow/stores/account/User';
    import {AccountState} from '@klipper/bow/stores/account/AccountState';
    import {AjaxFormContent} from '@klipper/bow/mixins/http/AjaxFormContent';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class ProfileSettings extends mixins(AjaxFormContent) {
        public firstName: string|null = null;

        public lastName: string|null = null;

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
            this.firstName = this.user ? this.user.firstName as string : null;
            this.lastName = this.user ? this.user.lastName as string : null;
        }

        public cancel(): void {
            this.editMode = false;
        }

        public async save(): Promise<void> {
            if (this.isValidForm()) {
                const res = await this.fetchData<MapKey>(async (canceler: Canceler): Promise<MapKey|null> => {
                    return await this.$api.request( {
                        url: '/user',
                        method: 'PATCH',
                        data: {
                            first_name: this.firstName,
                            last_name: this.lastName,
                        },
                    }, canceler);
                }, false);

                if (res && this.user) {
                    this.$store.commit('account/refreshUserSuccess', {
                        id: this.user.id,
                        username: this.user.username,
                        email: this.user.email,
                        lastName: res.last_name,
                        firstName: res.first_name,
                        fullName: res.full_name,
                        initial: res.initial,
                        imageUrl: res.image_url,
                    } as User);

                    this.editMode = false;
                    this.loading = false;
                }
            }
        }
    }
</script>
