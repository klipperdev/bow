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
                         @created="onCreated"
                         @deleted="onDeleted"
        >
            <template v-slot:header="{data}">
                <k-standard-view-title-icon icon="fa fa-fw fa-user-tag"></k-standard-view-title-icon>
                <k-standard-view-title>{{ $ml('role') }} {{ $oc(data).label('~') }}</k-standard-view-title>
            </template>

            <template v-slot:card="{isCreate, data, loading, push, editMode, currentLocale, fieldErrors}">
                <k-card-section locked>
                    <v-row>
                        <k-col-label :label="$mfl('role', 'label')" :edit-mode="editMode" edit-label-required :edit-translate="currentLocale">
                            {{ $oc(data).label('~') }}

                            <template v-slot:edit>
                                <v-text-field type="text"
                                              dense
                                              filled
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

                        <k-col-label :label="$mfl('role', 'name')" :edit-mode="editMode" edit-label-required>
                            {{ $oc(data).name('~') }}

                            <template v-slot:edit>
                                <v-text-field type="text"
                                              dense
                                              filled
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
                        <k-col-label :label="$mal('role', 'children')" :edit-mode="editMode">
                            <span v-if="0 === $oc(data).children([]).length">~</span>

                            <v-chip v-else
                                    v-for="role in $oc(data).children([])"
                                    :key="$oc(role).label()"
                                    :to="{name: 'settings-org-role', params: {org: $org, id: role.id}}"
                                    class="mr-1 mb-1"
                            >
                                {{ $oc(role).label() }}
                            </v-chip>

                            <template v-slot:edit>
                                <k-select-entity name="children"
                                                 v-model="data.children"
                                                 filled
                                                 multiple
                                                 target-metadata="role"
                                                 :disabled="loading"
                                                 :error-messages="fieldErrors('children')"
                                                 :fields="['name']"
                                                 :filters="data.id ? {field: 'id', operator: 'not_equal', value: data.id} : undefined"
                                ></k-select-entity>
                            </template>
                        </k-col-label>
                    </v-row>
                </k-card-section>

                <k-card-section-system metadata="role"
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
    import {PushRequestDataEvent} from '@klipper/bow/http/event/PushRequestDataEvent';
    import {DeleteRequestDataEvent} from '@klipper/bow/http/event/DeleteRequestDataEvent';
    import ChangePassword from '@klipper/bow/views/settings/organizations/ChangePassword.vue';
    import {extractIdentifiers} from '@klipper/bow/utils/object';

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
            return await this.$api.request({
                method: event.getMethod(),
                url: event.getPushUrl('/{organization}/roles'),
                params: event.getRequestParams(),
                data: {
                    name: event.data.name,
                    label: event.data.label,
                    children: extractIdentifiers<string>('name', event.data.children),
                },
            }, event.canceler);
        }

        public onCreated(res: Record<string, any>): void {
            this.$router.replace({
                name: 'settings-org-role',
                params: {
                    id: res.id,
                },
            });
        }

        public async deleteRequest(event: DeleteRequestDataEvent): Promise<void> {
            await this.$api.request({
                url: '/{organization}/roles/' + event.id,
                method: 'DELETE',
                params: event.getRequestParams(),
            }, event.canceler);
        }

        public onDeleted(): void {
            this.$router.replace({name: 'settings-org-roles'});
        }
    }
</script>
