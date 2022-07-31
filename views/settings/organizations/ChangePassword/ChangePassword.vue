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
        :id="'changePassword_' + _uid"
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
            :activator="'#changePassword_' + _uid"
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
                        :class="$classes('primary--text', 'text--lighten-3')"
                    >
                        <slot
                            name="title"
                        >
                            {{ $t('views.settings-organization-user.change-password') }}
                        </slot>
                    </v-card-title>

                    <k-form-alert
                        :http-error="previousError"
                        :excluded-fields="['old_password', 'new_password']"
                    />

                    <v-container>
                        <v-row v-if="isUserMetadata">
                            <k-col-label
                                :colProps="{sm: 12}"
                                vertical
                                edit-mode
                                edit-label-required
                                :label="$t('views.settings-organization-user.current-password')"
                            >
                                <v-text-field
                                    type="text"
                                    filled
                                    autofocus
                                    autocomplete='off'
                                    v-model="oldPassword"
                                    :error-messages="fieldErrors('old_password')"
                                    :disabled="loading"
                                    :append-icon="showOldPassword ? 'visibility_off' : 'visibility'"
                                    :type="showOldPassword ? 'text' : 'password'"
                                    :rules="[$r('required')]"
                                    @keydown.enter="save"
                                    @click:append="showOldPassword = !showOldPassword"
                                />
                            </k-col-label>
                        </v-row>

                        <v-row>
                            <k-col-label
                                :colProps="{sm: 12}"
                                vertical
                                edit-mode
                                edit-label-required
                                :label="$t('views.settings-organization-user.new-password')"
                            >
                                <v-text-field
                                    type="text"
                                    filled
                                    autocomplete='off'
                                    v-model="newPassword"
                                    :error-messages="fieldErrors('new_password')"
                                    :disabled="loading"
                                    :append-icon="showNewPassword ? 'visibility_off' : 'visibility'"
                                    :type="showNewPassword ? 'text' : 'password'"
                                    :rules="[$r('required')]"
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
import {AjaxFormContent} from '@klipper/bow/composables/mixins/http/ajaxFormContent';
import {SnackbarMessage} from '@klipper/bow/snackbar/SnackbarMessage';
import {Canceler} from '@klipper/http-client/Canceler';
import {defineComponent} from '@vue/composition-api';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default defineComponent({
    name: 'ChangePassword',

    inheritAttrs: false,

    mixins: [
        AjaxFormContent,
    ],

    props: {
        metadata: {
            type: String,
            default: 'organization_user',
        },

        userId: {
            type: [String, Number],
            required: true,
        },

        maxWidth: {
            type: [String, Number],
            default: '600',
        },

        requestUrl: {
            type: String,
            default: undefined,
        },
    },

    data(): Dictionary<any> {
        return {
            oldPassword: null as string|null,
            newPassword: null as string|null,
            showOldPassword: false as boolean,
            showNewPassword: false as boolean,
            dialog: false as boolean,
        };
    },

    computed: {
        isUserMetadata(): boolean {
            return 'user' === this.metadata;
        },

        genRequestUrl(): string {
            if (this.isUserMetadata) {
                return '/user/change-password';
            }

            return '/{organization}/' + this.$metadata.getPluralName(this.metadata) + '/' + this.userId + '/change-password';
        },
    },

    methods: {
        async save(): Promise<void> {
            if (this.isValidForm()) {
                const res = await this.fetchData<Dictionary<any>>(async (canceler: Canceler): Promise<Dictionary<any>|null> => {
                    const data = {
                        new_password: this.newPassword,
                    };

                    if (this.isUserMetadata) {
                        data.old_password = this.oldPassword;
                    }

                    return await this.$api.request({
                        url: this.genRequestUrl,
                        method: 'PATCH',
                        data,
                    }, canceler);
                }, false);

                if (null !== res) {
                    this.dialog = false;
                    this.$snackbar.snack(new SnackbarMessage(this.$t('views.settings-organization-user.password-changed-successfully') as string, 'success'));
                }
            }
        },
    },

    watch: {
        dialog: {
            handler(): void {
                this.oldPassword = null;
                this.newPassword = null;
                this.showOldPassword = false;
                this.showNewPassword = false;
                this.resetForm();
            },
        },
    },
});
</script>
