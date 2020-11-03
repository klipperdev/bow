<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-container>
        <k-standard-view ref="sdtView"
                         metadata="user"
                         :fetch-request="fetchRequest"
        >
            <template v-slot:header="{data}">
                <v-icon class="mr-2" :size="30" :color="$color('primary', 'primary lighten-3')">
                    fa fa-fw fa-user
                </v-icon>

                <k-standard-view-title>{{ $oc(data).user.full_name($oc(data).user.username('~')) }}</k-standard-view-title>
            </template>

            <template v-slot:card="{isCreate, data, loading, push, editMode, currentLocale, fieldErrors}">
                <k-card-section locked>
                    <v-row>
                        <k-col-label :label="$mfl('user', 'full_name')">
                            {{ $oc(data).user.full_name('~') }}
                        </k-col-label>

                        <k-col-label :skeleton-loader-props="{type: 'image', width: '120', height: '120', class: 'ma-0'}">
                            <k-uploadable-img
                                :size="120"
                                rounded
                                :api-src="$oc(data).user.image_url()"
                                :api-upload-src="getUploadImageUrl($oc(data).id())"
                                @complete="onUploadImageComplete"
                            >
                            </k-uploadable-img>
                        </k-col-label>
                    </v-row>

                    <v-row>
                        <k-col-label :label="$mfl('user', 'username')">
                            {{ $oc(data).user.username('~') }}
                        </k-col-label>

                        <k-col-label :label="$mfl('organization_user', 'enabled')" content-width="40">
                            <v-switch disabled hide-details class="ma-0" v-model="$oc(data).enabled()"></v-switch>
                        </k-col-label>
                    </v-row>

                    <v-row>
                        <k-col-label :edit-mode="editPassword" :label="$t('views.settings-organization-user.password')">
                            <change-password :user-id="$oc(data).id()"></change-password>
                        </k-col-label>
                    </v-row>
                </k-card-section>

                <k-card-section locked :title="$t('security')">
                    <v-row>
                        <k-col-label :label="$mpl('role')">
                            <span v-if="0 === $oc(data).roles([]).length">~</span>

                            <v-chip v-for="role in $oc(data).roles([])" v-else :key="role">
                                {{ role }}
                            </v-chip>
                        </k-col-label>

                        <k-col-label :label="$mpl('group')">
                            <span v-if="0 === $oc(data).groups([]).length">~</span>

                            <v-chip v-for="group in $oc(data).groups([])" v-else :key="$oc(group).name()">
                                {{ $oc(group).label($oc(group).name('~')) }}
                            </v-chip>
                        </k-col-label>
                    </v-row>
                </k-card-section>

                <k-card-section-system metadata="organization_user"
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

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component({
        components: {
            ChangePassword,
        },
    })
    export default class OrganizationUserView extends Vue {
        private editPassword: boolean = false;

        public get allowedFileTypes(): string[] {
            return ['image/*', '.jpg', '.jpeg', '.png', '.tif', '.tiff', '.gif', '.svg', '.webp'];
        }

        public metaInfo(): MetaInfo {
            return {
                title: this.$ml('organization_user'),
            };
        }

        public getUploadImageUrl(id: string|number): string {
            return this.$api.getBaseUrl() + '/' + this.$store.state.account.organization + '/organization_users/' + id + '/user/upload';
        }

        public async onUploadImageComplete(): Promise<void> {
            await (this.$refs.sdtView as any).refresh();
        }

        public async fetchRequest(event: FetchRequestDataEvent): Promise<object|null> {
            return await this.$api.request({
                method: 'GET',
                url: '/{organization}/organization_users/' + event.id,
            }, event.canceler);
        }
    }
</script>
