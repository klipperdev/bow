<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-container>
        <k-standard-view ref="sdtView"
                         metadata="role"
                         :fetch-request="fetchRequest"
                         :push-request="pushRequest"
                         :delete-request="deleteRequest"
                         @deleted-item="onDeletedItem"
        >
            <template v-slot:header="{data}">
                <v-icon class="mr-2" :size="30" :color="$color('primary', 'primary lighten-3')">
                    fa fa-fw fa-user-tag
                </v-icon>

                <k-standard-view-title>{{ $ml('role') }} {{ $oc(data).label('~') }}</k-standard-view-title>
            </template>

            <template v-slot:standardActions="{data, loading, enableEdit}">
                <v-btn outlined :disabled="loading" @click="enableEdit()">
                    <v-icon>edit</v-icon>
                </v-btn>
            </template>

            <template v-slot:card="{data, loading, push, editMode, fieldErrors}">
                <k-card-section locked>
                    <v-row>
                        <k-col-label :label="$mfl('role', 'label')" :edit-mode="editMode" edit-label-required>
                            {{ $oc(data).label('~') }}

                            <template v-slot:edit>
                                <v-text-field type="text"
                                              dense
                                              outlined
                                              v-model="data.label"
                                              autofocus
                                              :error-messages="fieldErrors('label')"
                                              @keydown.enter="push"
                                              :disabled="loading"
                                              :rules="[$r('required')]"
                                ></v-text-field>
                            </template>
                        </k-col-label>

                        <k-col-label :label="$mfl('role', 'name')" :edit-mode="editMode" edit-label-required>
                            {{ $oc(data).name('~') }}

                            <template v-slot:edit>
                                <v-text-field type="text"
                                              dense
                                              outlined
                                              v-model="data.name"
                                              :error-messages="fieldErrors('name')"
                                              @keydown.enter="push"
                                              :disabled="loading"
                                              :rules="[$r('required')]"
                                ></v-text-field>
                            </template>
                        </k-col-label>
                    </v-row>

                    <v-row>
                        <k-col-label :label="$mal('role', 'children')">
                            <span v-if="0 === $oc(data).children([]).length">~</span>

                            <v-chip v-else
                                    v-for="role in $oc(data).children([])"
                                    :key="$oc(role).label()"
                                    :to="{name: 'settings-org-role', params: {org: $org, id: role.id}}"
                            >
                                {{ $oc(role).label() }}
                            </v-chip>
                        </k-col-label>
                    </v-row>
                </k-card-section>

                <k-card-section :title="$t('system.info')" dense close>
                    <v-row>
                        <k-col-label :label="$mfl('role', 'created_at')">
                            {{ $datetime($oc(data).created_at()) }}
                        </k-col-label>

                        <k-col-label :label="$mfl('role', 'updated_at')">
                            {{ $datetime($oc(data).updated_at()) }}
                        </k-col-label>
                    </v-row>
                </k-card-section>
            </template>
        </k-standard-view>
    </v-container>
</template>

<script lang="ts">
    import {MetaInfo} from 'vue-meta';
    import {Component, Vue} from 'vue-property-decorator';
    import {FetchRequestDataEvent} from '@klipper/bow/http/event/FetchRequestDataEvent';
    import {PushRequestDataEvent} from '@klipper/bow/http/event/PushRequestDataEvent';
    import {DeleteRequestDataEvent} from '@klipper/bow/http/event/DeleteRequestDataEvent';
    import ChangePassword from '@klipper/bow/views/settings/organizations/ChangePassword.vue';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component({
        components: {
            ChangePassword,
        },
    })
    export default class OrganizationRoleView extends Vue {
        public metaInfo(): MetaInfo {
            return {
                title: this.$ml('role'),
            };
        }

        public async fetchRequest(event: FetchRequestDataEvent): Promise<object|null> {
            return await this.$api.request({
                method: 'GET',
                url: '/{organization}/roles/' + event.id,
                params: event.getRequestParams(),
            }, event.canceler);
        }

        public async pushRequest(event: PushRequestDataEvent): Promise<object|null> {
            const res = await this.$api.request({
                method: event.getMethod(),
                url: event.getPushUrl('/{organization}/roles'),
                params: event.getRequestParams(),
                data: {
                    name: event.data.name,
                    label: event.data.label,
                },
            }, event.canceler);

            if (res && event.isCreate()) {
                this.$router.replace({
                    name: 'settings-org-role',
                    params: {
                        id: res.id,
                    },
                });
            }

            return res;
        }

        public async deleteRequest(event: DeleteRequestDataEvent): Promise<void> {
            await this.$api.request({
                url: '/{organization}/roles/' + event.id,
                method: 'DELETE',
                params: event.getRequestParams(),
            }, event.canceler);
        }

        public onDeletedItem(): void {
            this.$router.replace({name: 'settings-org-roles'});
        }
    }
</script>
