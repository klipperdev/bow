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
                    {{ $t('details') }}
                </v-subheader>
            </v-col>

            <v-col
                cols="2"
                class="text-right"
            >
                <v-btn
                    :id="'orgSettingsEditBtn' + self._uid"
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
                    <v-icon>
                        edit
                    </v-icon>

                    <v-tooltip
                        :activator="'#orgSettingsEditBtn' + self._uid" left
                    >
                        <span>
                            {{ $t('edit') }}
                        </span>
                    </v-tooltip>
                </v-btn>
            </v-col>
        </v-row>

        <v-container
            class="pt-3 pb-3"
        >
            <k-form-alert
                :http-error="previousError"
                metadata="organization"
                :excluded-fields="['label', 'name']"
            />

            <v-row>
                <k-col-label
                    vertical :edit-mode="editMode"
                    edit-label-required
                    :label="self.$t('model.organization.fields.name')"
                    :empty="!loading && !self.$oc(organization).name()"
                >
                    <template v-slot:read>
                        {{ $oc(organization).name('~') }}
                    </template>

                    <template v-slot:edit>
                        <v-text-field
                            type="text"
                            filled
                            v-model="name"
                            autofocus
                            :error-messages="fieldErrors('name')"
                            :disabled="loading"
                            :rules="[self.$r('required')]"
                            @keydown.enter="save"
                        />
                    </template>
                </k-col-label>

                <k-col-label
                    vertical :edit-mode="editMode"
                    edit-label-required
                    :label="self.$t('model.organization.fields.label')"
                    :empty="!loading && !self.$oc(organization).label()"
                >
                    <template v-slot:read>
                        {{ $oc(organization).label('~') }}
                    </template>

                    <template v-slot:edit>
                        <v-text-field
                            type="text"
                            filled
                            v-model="label"
                            :error-messages="fieldErrors('label')"
                            :disabled="loading"
                            :rules="[self.$r('required')]"
                            @keydown.enter="save"
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
    </v-form>
</template>

<script lang="ts">
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {AjaxFormContent} from '@klipper/bow/mixins/http/AjaxFormContent';
import {Selfable} from '@klipper/bow/mixins/Selfable';
import {AccountState} from '@klipper/bow/stores/account/AccountState';
import {Organization} from '@klipper/bow/stores/account/Organization';
import {Canceler} from '@klipper/http-client/Canceler';
import {mixins} from 'vue-class-component';
import {Component, Watch} from 'vue-property-decorator';
import {Location} from 'vue-router';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class OrganizationSettingsDetails extends mixins(
    AjaxFormContent,
    Selfable,
) {
    private name: string | null = null;

    private label: string | null = null;

    private editMode: boolean = false;

    private get account(): AccountState | undefined {
        return this.$store && this.$store.state.account && this.$store.state.account
            ? this.$store.state.account
            : undefined;
    }

    private get organization(): Organization | undefined {
        return this.account ? this.account.organizationInfo : undefined;
    }

    private cancel(): void {
        this.editMode = false;
    }

    private async save(): Promise<void> {
        if (this.isValidForm()) {
            const res = await this.fetchData<Dictionary<any>>(async (canceler: Canceler): Promise<Dictionary<any> | null> => {
                return await this.$api.request({
                    url: '/' + this.$org + '/organization',
                    method: 'PATCH',
                    data: {
                        name: this.name,
                        label: this.label,
                    },
                }, canceler);
            }, false);

            if (res) {
                const replaceRouteRequired = this.organization
                    ? this.organization.name !== res.name : false;

                if (replaceRouteRequired) {
                    const cr = this.$router.currentRoute;

                    this.$router.replace({
                        name: cr.name,
                        hash: cr.hash,
                        query: Object.assign({}, cr.query),
                        params: Object.assign({}, cr.params, {
                            org: res.name,
                        }),
                    } as Location).then(() => {});
                } else {
                    this.$store.commit('account/updateOrganizationInfoSuccess', {
                        id: res.id,
                        name: res.name,
                        label: res.label,
                        imageUrl: res.image_url,
                    } as Organization);

                    this.editMode = false;
                    this.loading = false;
                }
            }
        }
    }

    @Watch('editMode')
    private watchEditMode(): void {
        this.name = this.organization ? this.organization.name : null;
        this.label = this.organization ? this.organization.label : null;
    }
}
</script>
