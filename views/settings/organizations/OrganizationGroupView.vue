<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-container>
        <k-standard-view ref="sdtView"
                         metadata="group"
                         :fetch-request="fetchRequest"
                         :push-request="pushRequest"
                         :delete-request="deleteRequest"
                         @deleted-item="onDeletedItem"
        >
            <template v-slot:header="{data}">
                <v-icon class="mr-2" :size="30" :color="$color('primary', 'primary lighten-3')">
                    fa fa-fw fa-user-tag
                </v-icon>

                <k-standard-view-title>{{ $ml('group') }} {{ $oc(data).label('~') }}</k-standard-view-title>
            </template>

            <template v-slot:card="{isCreate, data, loading, push, editMode, currentLocale, fieldErrors}">
                <k-card-section locked>
                    <v-row>
                        <k-col-label :label="$mfl('group', 'label')" :edit-mode="editMode" edit-label-required :edit-translate="currentLocale">
                            {{ $oc(data).label('~') }}

                            <template v-slot:edit>
                                <v-text-field type="text"
                                              dense
                                              outlined
                                              name="label"
                                              v-model="data.label"
                                              autofocus
                                              :error-messages="fieldErrors('label')"
                                              @keydown.enter="push"
                                              :disabled="loading"
                                              :rules="[$r('required')]"
                                ></v-text-field>
                            </template>
                        </k-col-label>

                        <k-col-label :label="$mfl('group', 'name')" :edit-mode="editMode" edit-label-required>
                            {{ $oc(data).name('~') }}

                            <template v-slot:edit>
                                <v-text-field type="text"
                                              dense
                                              outlined
                                              name="name"
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
                        <k-col-label :label="$mpl('role')" :edit-mode="editMode">
                            <span v-if="0 === $oc(data).roles([]).length">~</span>

                            <v-chip v-else
                                    v-for="role in $oc(data).roles([])"
                                    :key="typeof role === 'object' ? role['name'] : role"
                                    class="mr-1 mb-1"
                            >
                                {{ role }}
                            </v-chip>

                            <template v-slot:edit>
                                <k-select-entity name="roles"
                                                 v-model="data.roles"
                                                 outlined
                                                 multiple
                                                 target-metadata="role"
                                                 :disabled="loading"
                                                 :error-messages="fieldErrors('roles')"
                                                 item-value="name"
                                                 :fields="['name']"
                                                 :filters="data.id ? {field: 'name', operator: 'not_equal', value: 'ROLE_USER'} : undefined"
                                ></k-select-entity>
                            </template>
                        </k-col-label>
                    </v-row>
                </k-card-section>

                <k-card-section-system metadata="group"
                                       :data="data"
                                       :user-track="false"
                                       :locked="editMode"
                                       v-if="!isCreate"
                ></k-card-section-system>
            </template>
        </k-standard-view>
    </v-container>
</template>

<script lang="ts">
    import {MetaInfo} from 'vue-meta';
    import {Component, Vue} from 'vue-property-decorator';
    import {FetchRequestDataEvent} from '@klipper/bow/http/event/FetchRequestDataEvent';
    import ChangePassword from '@klipper/bow/views/settings/organizations/ChangePassword.vue';
    import {PushRequestDataEvent} from '@klipper/bow/http/event/PushRequestDataEvent';
    import {DeleteRequestDataEvent} from '@klipper/bow/http/event/DeleteRequestDataEvent';
    import {extractIdentifiers} from '@klipper/bow/utils/object';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component({
        components: {
            ChangePassword,
        },
    })
    export default class OrganizationGroupView extends Vue {
        public metaInfo(): MetaInfo {
            return {
                title: this.$ml('group'),
            };
        }

        public async fetchRequest(event: FetchRequestDataEvent): Promise<object|null> {
            return await this.$api.request({
                method: 'GET',
                url: '/{organization}/groups/' + event.id,
                params: event.getRequestParams(),
            }, event.canceler);
        }

        public async pushRequest(event: PushRequestDataEvent): Promise<object|null> {
            const res = await this.$api.request({
                method: event.getMethod(),
                url: event.getPushUrl('/{organization}/groups'),
                params: event.getRequestParams(),
                data: {
                    name: event.data.name,
                    label: event.data.label,
                    roles: extractIdentifiers<string>('name', event.data.roles),
                },
            }, event.canceler);

            if (res && event.isCreate()) {
                this.$router.replace({
                    name: 'settings-org-group',
                    params: {
                        id: res.id,
                    },
                });
            }

            return res;
        }

        public async deleteRequest(event: DeleteRequestDataEvent): Promise<void> {
            await this.$api.request({
                url: '/{organization}/groups/' + event.id,
                method: 'DELETE',
                params: event.getRequestParams(),
            }, event.canceler);
        }

        public onDeletedItem(): void {
            this.$router.replace({name: 'settings-org-groups'});
        }
    }
</script>
