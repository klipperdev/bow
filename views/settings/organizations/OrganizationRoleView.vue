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
                <v-icon class="mr-2" :size="30" :color="$color('primary', 'primary lighten-3')">
                    fa fa-fw fa-user-tag
                </v-icon>

                <k-standard-view-title>{{ $ml('role') }} {{ $oc(data).label('~') }}</k-standard-view-title>
            </template>

            <template v-slot="{data}">
                <v-card flat>
                    <k-card-section locked>
                        <v-row>
                            <k-col-label :label="$mfl('role', 'label')">
                                {{ $oc(data).label('~') }}
                            </k-col-label>

                            <k-col-label :label="$mfl('role', 'name')">
                                {{ $oc(data).name('~') }}
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
                </v-card>
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
            }, event.canceler);
        }
    }
</script>
