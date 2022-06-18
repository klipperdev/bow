<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-container>
        <div>
            <v-row class="ma-0" align="center" style="height: 52px;">
                <v-col class="flex-grow-1 ma-0 pa-0 d-flex align-center">
                    <k-standard-view-title :title="$t('views.portal-user.invite-person')"/>
                </v-col>
            </v-row>

            <v-form
                ref="form"
                autocomplete="off"
                @submit.prevent=""
            >
                <v-card>
                    <k-form-alert
                        :http-error="previousError"
                        metadata="portal_user"
                    />

                    <k-card-section locked dense>
                        <v-row>
                            <k-col-label
                                :label="$mfl('user', 'email')"
                                edit-mode
                                edit-label-required
                            >
                                <template v-slot:edit>
                                    <k-form-email
                                        ref="email"
                                        autofocus
                                        v-model="email"
                                        :disabled="loading"
                                        :rules="[$r('required')]"
                                        filled
                                        @keydown.enter="send"
                                    />
                                </template>
                            </k-col-label>
                        </v-row>

                        <v-row>
                            <k-col-label>
                                <v-btn
                                    color="primary"
                                    depressed
                                    class="ma-0"
                                    block
                                    :disabled="!email"
                                    :loading="loading"
                                    @click="send"
                                >
                                    {{ $t('views.portal-user.invite') }}

                                    <v-icon
                                        right
                                        dark
                                        small
                                    >
                                        fa-fw fa-paper-plane
                                    </v-icon>
                                </v-btn>
                            </k-col-label>
                        </v-row>
                    </k-card-section>
                </v-card>
            </v-form>
        </div>
    </v-container>
</template>

<script lang="ts">
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {AjaxFormContent} from '@klipper/bow/mixins/http/AjaxFormContent';
import {Canceler} from '@klipper/http-client/Canceler';
import {mixins} from 'vue-class-component';
import {MetaInfo} from 'vue-meta';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class PortalUserViewInvitation extends mixins(
    AjaxFormContent,
) {
    @Prop({type: [String, Number]})
    public portal!: string|number;

    private email: string|null = null;

    public metaInfo(): MetaInfo {
        return {
            title: this.$ml('portal_user') + ' : ' + this.$t('views.portal-user.invite-person'),
        };
    }

    private async send(): Promise<void> {
        if (this.isValidForm()) {
            const res = await this.fetchData<Dictionary<any>>(async (canceler: Canceler): Promise<Dictionary<any>|null> => {
                return await this.$api.request({
                    url: this.$org + '/portal_users/invite',
                    method: 'POST',
                    data: {
                        portal: this.portal || null,
                        email: this.email,
                    },
                }, canceler);
            }, false);

            if (res) {
                this.$emit('invited', res);
            } else if (this.previousError && 404 === this.previousError.statusCode) {
                this.$emit('invalid', this.email);
            }
        }
    }
}
</script>
