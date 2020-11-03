<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-container>
        <k-standard-view ref="sdtView"
                         metadata="organization"
                         :fetch-request="fetchRequest"
                         :push-request="pushRequest"
                         :delete-request="deleteRequest"
                         @deleted-item="onDeletedItem"
        >
            <template v-slot:header="{data, isCreate}">
                <k-standard-view-title-icon icon="fa fa-fw fa-building"></k-standard-view-title-icon>
                <k-standard-view-title>{{ isCreate ? $t('new') : $oc(data).label('~') }}</k-standard-view-title>
            </template>

            <template v-slot:standardActions="{data, loading, enableEdit}">
                <v-btn outlined :disabled="loading" @click="enableEdit()">
                    <v-icon>edit</v-icon>
                </v-btn>
            </template>

            <template v-slot:card="{data, loading, push, editMode, fieldErrors}">
                <k-card-section locked>
                    <v-row>
                        <k-col-label :label="$mfl('organization', 'label')" :edit-mode="editMode" edit-label-required>
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

                        <k-col-label :label="$mfl('organization', 'name')" :edit-mode="editMode" edit-label-required>
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

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class OrganizationCreate extends Vue {
        public metaInfo(): MetaInfo {
            return {
                title: this.$ml('organization'),
            };
        }

        public async fetchRequest(event: FetchRequestDataEvent): Promise<object|null> {
            return await this.$api.request({
                method: 'GET',
                url: '/{organization}/organizations/' + event.id,
            }, event.canceler);
        }

        public async pushRequest(event: PushRequestDataEvent): Promise<object|null> {
            const res = await this.$api.request({
                method: event.getMethod(),
                url: event.getPushUrl('/{organization}/organizations'),
                data: {
                    name: event.data.name,
                    label: event.data.label,
                },
            }, event.canceler);

            if (res && event.isCreate()) {
                this.$router.replace({
                    name: 'user-organization',
                    params: {
                        id: res.id,
                    },
                });
            }

            return res;
        }

        public async deleteRequest(event: DeleteRequestDataEvent): Promise<void> {
            await this.$api.request({
                url: '/{organization}/organizations/' + event.id,
                method: 'DELETE',
            }, event.canceler);
        }

        public onDeletedItem(): void {
            this.$router.replace('/');
        }
    }
</script>
