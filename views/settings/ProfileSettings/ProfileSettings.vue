<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-form
        ref="form"
        @submit.prevent=""
    >
        <v-row
            class="ma-0"
            align="center"
        >
            <v-col
                cols="10"
                class="ma-0 pa-0"
            >
                <v-subheader
                    :class="self.$classes('primary--text', 'text--lighten-2')"
                >
                    {{ $t('model.profile.label') }}
                </v-subheader>
            </v-col>

            <v-col
                cols="2"
                class="text-right"
            >
                <v-btn
                    :id="'profileSettingsEditBtn' + self._uid"
                    color="primary"
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

                    <v-tooltip
                        :activator="'#profileSettingsEditBtn' + self._uid" left
                    >
                        <span>
                            {{ $t('edit') }}
                        </span>
                    </v-tooltip>
                </v-btn>
            </v-col>
        </v-row>

        <v-card>
            <v-container
                class="pt-3 pb-3"
            >
                <k-form-alert
                    :http-error="previousError"
                    metadata="user"
                    :excluded-fields="['first_name', 'last_name']"
                />

                <v-row>
                    <k-col-label
                        vertical
                        :edit-mode="editMode"
                        edit-label-required
                        :label="self.$mfl('user', 'first_name')"
                        :empty="!loading && !self.$oc(user).firstName()"
                    >
                        <template v-slot:read>
                            {{ $oc(user).firstName('~') }}
                        </template>

                        <template v-slot:edit>
                            <v-text-field
                                type="text"
                                filled
                                v-model="firstName"
                                autofocus
                                :error-messages="fieldErrors('first_name')"
                                @keydown.enter="save"
                                :disabled="loading"
                                :rules="[self.$r('required')]"
                            />
                        </template>
                    </k-col-label>

                    <k-col-label
                        vertical
                        :edit-mode="editMode"
                        edit-label-required
                        :label="self.$mfl('user', 'last_name')"
                        :empty="!loading && !self.$oc(user).lastName()"
                    >
                        <template v-slot:read>
                            {{ $oc(user).lastName('~') }}
                        </template>

                        <template v-slot:edit>
                            <v-text-field
                                type="text"
                                filled
                                v-model="lastName"
                                :error-messages="fieldErrors('last_name')"
                                @keydown.enter="save"
                                :disabled="loading"
                                :rules="[self.$r('required')]"
                            />
                        </template>
                    </k-col-label>
                </v-row>
            </v-container>

            <v-card-actions
                v-if="editMode"
                class="pt-0 text-center"
            >
                <v-spacer/>

                <v-btn
                    small
                    text
                    @click="cancel"
                >
                    {{ $t('cancel')}}
                </v-btn>

                <v-btn
                    small
                    depressed
                    color="primary"
                    :loading="loading"
                    @click="save"
                >
                    {{ $t('save')}}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<script lang="ts">
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {AjaxFormContent} from '@klipper/bow/mixins/http/AjaxFormContent';
import {Selfable} from '@klipper/bow/mixins/Selfable';
import {AccountState} from '@klipper/bow/stores/account/AccountState';
import {User} from '@klipper/bow/stores/account/User';
import {Canceler} from '@klipper/http-client/Canceler';
import {mixins} from 'vue-class-component';
import {Component, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class ProfileSettings extends mixins(
    AjaxFormContent,
    Selfable,
) {
    private firstName: string | null = null;

    private lastName: string | null = null;

    private editMode: boolean = false;

    private get account(): AccountState | undefined {
        return this.$store && this.$store.state.account && this.$store.state.account
            ? this.$store.state.account
            : undefined;
    }

    private get user(): User | undefined {
        return this.account && this.account.user ? this.account.user : undefined;
    }

    private cancel(): void {
        this.editMode = false;
    }

    private async save(): Promise<void> {
        if (this.isValidForm()) {
            const res = await this.fetchData<Dictionary<any>>(async (canceler: Canceler): Promise<Dictionary<any> | null> => {
                return await this.$api.request({
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

    @Watch('editMode')
    private watchEditMode(): void {
        this.firstName = this.user ? this.user.firstName as string : null;
        this.lastName = this.user ? this.user.lastName as string : null;
    }
}
</script>
