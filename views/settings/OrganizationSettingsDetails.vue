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
                <v-btn :id="'orgSettingsEditBtn' + _uid"
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

                    <v-tooltip :activator="'#orgSettingsEditBtn' + _uid" left eager>
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
                <k-col-label vertical :edit-mode="editMode" edit-label-required :label="$t('model.organization.fields.name')">
                    <template v-slot:view>
                        {{ $oc(organization).name('~') }}
                    </template>

                    <template v-slot:edit>
                        <v-text-field type="text"
                                      outlined
                                      v-model="name"
                                      autofocus
                                      :error-messages="fieldErrors('name')"
                                      @keydown.enter="save"
                                      :disabled="loading"
                                      :rules="[$r('required')]"
                        ></v-text-field>
                    </template>
                </k-col-label>

                <k-col-label vertical :edit-mode="editMode" edit-label-required :label="$t('model.organization.fields.label')">
                    <template v-slot:view>
                        {{ $oc(organization).label('~') }}
                    </template>

                    <template v-slot:edit>
                        <v-text-field type="text"
                                      outlined
                                      v-model="label"
                                      :error-messages="fieldErrors('label')"
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
    </v-form>
</template>

<script lang="ts">
    import {Component, Watch} from 'vue-property-decorator';
    import {mixins} from 'vue-class-component';
    import {Location} from 'vue-router';
    import {MapKey} from '@klipper/http-client/models/MapKey';
    import {Canceler} from '@klipper/http-client/Canceler';
    import {Organization} from '@klipper/bow/stores/account/Organization';
    import {AccountState} from '@klipper/bow/stores/account/AccountState';
    import {AjaxFormContent} from '@klipper/bow/mixins/http/AjaxFormContent';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class OrganizationSettingsDetails extends mixins(AjaxFormContent) {
        public name: string|null = null;

        public label: string|null = null;

        private editMode: boolean = false;

        public get account(): AccountState|undefined {
            return this.$store && this.$store.state.account && this.$store.state.account
                ? this.$store.state.account
                : undefined;
        }

        public get organization(): Organization|undefined {
            return this.account ? this.account.organizationInfo : undefined;
        }

        @Watch('editMode')
        public watchEditMode(): void {
            this.name = this.organization ? this.organization.name : null;
            this.label = this.organization ? this.organization.label : null;
        }

        public cancel(): void {
            this.editMode = false;
        }

        public async save(): Promise<void> {
            if (this.isValidForm()) {
                const res = await this.fetchData<MapKey>(async (canceler: Canceler): Promise<MapKey|null> => {
                    return await this.$api.request( {
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
                        } as Location);
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
    }
</script>
