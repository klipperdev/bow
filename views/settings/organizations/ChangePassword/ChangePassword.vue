<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-btn
        v-bind="$attrs"
        v-on="$listeners"
        :id="'changePassword_' + self._uid"
        :color="undefined === $attrs.color ? 'primary' : $attrs.color"
        :depressed="undefined === $attrs.depressed"
        :ripple="undefined === $attrs.ripple"
        :rounded="undefined === $attrs.rounded"
        :small="undefined === $attrs.small"
        :loading="loading"
    >
        <slot
            name="btn-content"
        >
            {{ $t('views.settings-organization-user.change-password') }}
        </slot>

        <v-dialog
            eager
            :activator="'#changePassword_' + self._uid"
            v-model="dialog"
            persistent
            :max-width="maxWidth"
            class="v-btn"
            content-class="scroller-theme--dark"
        >
            <v-form
                ref="form"
                @submit.prevent=""
            >
                <v-card>
                    <v-card-title
                        :class="self.$classes('primary--text', 'text--lighten-3')"
                    >
                        <slot
                            name="title"
                        >
                            {{ $t('views.settings-organization-user.change-password') }}
                        </slot>
                    </v-card-title>

                    <k-form-alert
                        :http-error="previousError"
                    />

                    <v-container>
                        <v-row>
                            <k-col-label
                                :colProps="{sm: 12}"
                                vertical
                                :label="self.$t('views.settings-organization-user.new-password')"
                            >
                                <v-text-field
                                    type="text"
                                    filled
                                    autofocus
                                    autocomplete='off'
                                    v-model="newPassword"
                                    :error-messages="fieldErrors('new_password')"
                                    :disabled="loading"
                                    :append-icon="showNewPassword ? 'visibility_off' : 'visibility'"
                                    :type="showNewPassword ? 'text' : 'password'"
                                    :rules="[self.$r('required')]"
                                    @keydown.enter="save"
                                    @click:append="showNewPassword = !showNewPassword"
                                />
                            </k-col-label>
                        </v-row>
                    </v-container>

                    <v-card-actions>
                        <v-spacer/>

                        <v-btn
                            text
                            ripple
                            :disabled="loading"
                            @click="dialog = false"
                        >
                            {{ $t('cancel') }}
                        </v-btn>

                        <v-btn
                            color="primary"
                            depressed
                            ripple
                            :loading="loading"
                            :disabled="loading"
                            @click="save"
                        >
                            {{ $t('save') }}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
    </v-btn>
</template>

<script lang="ts">
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {AjaxFormContent} from '@klipper/bow/mixins/http/AjaxFormContent';
import {Selfable} from '@klipper/bow/mixins/Selfable';
import {SnackbarMessage} from '@klipper/bow/snackbar/SnackbarMessage';
import {Canceler} from '@klipper/http-client/Canceler';
import {mixins} from 'vue-class-component';
import {Component, Prop, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class ChangePassword extends mixins(
    AjaxFormContent,
    Selfable,
) {
    @Prop({type: [String, Number], required: true})
    public userId: string|number;

    @Prop({type: String, default: '600'})
    public maxWidth: string;

    private newPassword: string|null = null;

    private showNewPassword: boolean = false;

    private dialog: boolean = false;

    public async save(): Promise<void> {
        if (this.isValidForm()) {
            const res = await this.fetchData<Dictionary<any>>(async (canceler: Canceler): Promise<Dictionary<any>|null> => {
                return await this.$api.request({
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

    @Watch('dialog')
    private watchEditMode(): void {
        this.newPassword = null;
        this.resetForm();
    }
}
</script>
