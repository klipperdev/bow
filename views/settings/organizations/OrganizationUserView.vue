<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-container>
        <k-standard-view ref="sdtView" :fetch-request="fetchRequest">
            <template v-slot:header="{data}">
                <span class="text-h6">{{ $oc(data).user.full_name('~') }}</span>
            </template>

            <template v-slot="{data}">
                <v-card flat>
                    <k-card-section locked>
                        <v-row>
                            <k-col-label :label="$mfl('user', 'full_name')">
                                {{ $oc(data).user.full_name('~') }}
                            </k-col-label>

                            <k-col-label>
                                <k-uploadable-img
                                    :size="120"
                                    rounded
                                    :api-src="$oc(data).user.image_url()"
                                    :api-upload-src="getUploadImageUrl(data.id)"
                                    @complete="onUploadImageComplete"
                                >
                                </k-uploadable-img>
                            </k-col-label>
                        </v-row>

                        <v-row>
                            <k-col-label :label="$mfl('organization_user', 'enabled')">
                                <v-simple-checkbox disabled :value="data.enabled"></v-simple-checkbox>
                            </k-col-label>

                            <k-col-label :edit-mode="editPassword" :label="$t('views.settings-organization-user.password')">
                                <change-password :user-id="$oc(data).id()"></change-password>
                            </k-col-label>
                        </v-row>

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

                    <k-card-section :title="$t('system.info')" dense close>
                        <v-row>
                            <k-col-label :label="$mfl('organization_user', 'created_at')">
                                {{ $datetime($oc(data).created_at()) }}
                            </k-col-label>

                            <k-col-label :label="$mfl('organization_user', 'updated_at')">
                                {{ $datetime($oc(data).updated_at()) }}
                            </k-col-label>
                        </v-row>
                    </k-card-section>
                </v-card>
            </template>
        </k-standard-view>
    </v-container>
</template>

<script lang="ts">
    import {MetaInfo} from 'vue-meta';
    import {Component, Vue} from 'vue-property-decorator';
    import {FetchRequestDataEvent} from '@klipper/bow/http/event/FetchRequestDataEvent';
    import ChangePassword from './ChangePassword.vue';

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
