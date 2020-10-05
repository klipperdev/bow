<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-btn :id="'changePassword_' + _uid"
           :color="$color('primary', 'primary lighten-2')"
           depressed
           ripple
           rounded
           small
           :loading="loading"
    >
        <slot name="btn-content">
            {{ $t('views.settings-organization-user.change-password') }}
        </slot>

        <v-dialog
            :activator="'#changePassword_' + _uid"
            v-model="dialog"
            persistent
            eager
            :max-width="maxWidth"
            class="v-btn"
            content-class="scroller-theme--dark"
        >
            <v-form ref="form" @submit.prevent>
                <v-card>
                    <v-card-title :class="$classes('primary--text', 'text--lighten-3')">
                        <slot name="title">
                            {{ $t('views.settings-organization-user.change-password') }}
                        </slot>
                    </v-card-title>

                    <v-container>
                        <v-row>
                            <k-col-label :colProps="{sm: 12}" vertical :label="$t('views.settings-organization-user.new-password')">
                                <v-text-field type="text"
                                              outlined
                                              autofocus
                                              autocomplete='off'
                                              v-model="newPassword"
                                              :error-messages="fieldErrors('new_password')"
                                              @keydown.enter="save"
                                              :disabled="loading"
                                              :append-icon="showNewPassword ? 'visibility_off' : 'visibility'"
                                              :type="showNewPassword ? 'text' : 'password'"
                                              @click:append="showNewPassword = !showNewPassword"
                                              :rules="[$r('required')]"
                                ></v-text-field>
                            </k-col-label>
                        </v-row>
                    </v-container>

                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn text
                               ripple
                               rounded
                               :disabled="loading"
                               @click="dialog = false">
                            {{ $t('cancel') }}
                        </v-btn>

                        <v-btn :color="$color('primary', 'primary lighten-2')"
                               depressed
                               ripple
                               rounded
                               :loading="loading"
                               :disabled="loading"
                               @click="save">
                            {{ $t('save') }}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
    </v-btn>
</template>

<script lang="ts">
    import {Component, Prop, Watch} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {AjaxFormContent} from '@klipper/bow/mixins/http/AjaxFormContent';
    import {MapKey} from '@klipper/http-client/models/MapKey';
    import {Canceler} from '@klipper/http-client/Canceler';
    import {SnackbarMessage} from '@klipper/bow/snackbar/SnackbarMessage';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class ChangePassword extends mixins(AjaxFormContent) {
        @Prop({type: [String, Number], required: true})
        public userId: string|number;

        @Prop({type: String, default: '600'})
        public maxWidth: string;

        public newPassword: string|null = null;

        public showNewPassword: boolean = false;

        private dialog: boolean = false;

        @Watch('dialog')
        public watchEditMode(): void {
            this.newPassword = null;
            this.resetForm();
        }

        public async save(): Promise<void> {
            if (this.isValidForm()) {
                const res = await this.fetchData<MapKey>(async (canceler: Canceler): Promise<MapKey|null> => {
                    return await this.$api.request( {
                        url: '/{organization}/organization_users/' + this.userId + '/change-password',
                        method: 'PATCH',
                        data: {
                            new_password: this.newPassword,
                        },
                    }, canceler);
                }, false);

                if (null !== res) {
                    this.dialog = false;
                    this.$snackbar.snack(new SnackbarMessage(this.$t('views.settings-organization-user.password-changed-successfully') as string, 'success'));
                }
            }
        }
    }
</script>
