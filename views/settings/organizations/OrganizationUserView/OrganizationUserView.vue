<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./OrganizationUserView.ts" />

<template>
    <v-container>
        <k-standard-view
            ref="sdtView"
            metadata="user"
            :fetch-request="fetchRequest"
        >
            <template v-slot:header="{data}">
                <k-standard-view-title-icon
                    icon="fa fa-fw fa-user"
                />

                <k-standard-view-title
                    :title="$oc(data).user.full_name($oc(data).user.username())"
                />
            </template>

            <template v-slot:card="{isCreate, data, loading, push, editMode, currentLocale, fieldErrors}">
                <k-card-section
                    locked
                >
                    <v-row>
                        <k-col-label
                            :label="$mfl('user', 'full_name')"
                            :empty="!loading && !$oc(data).user.full_name()"
                        >
                            {{ $oc(data).user.full_name('~') }}
                        </k-col-label>

                        <k-col-label
                            :skeleton-loader-props="{type: 'image', width: '120', height: '120', class: 'ma-0'}"
                            :empty="!loading && !$oc(data).user.image_url()"
                        >
                            <k-uploadable-img
                                :size="120"
                                rounded
                                :api-src="$oc(data).user.image_url()"
                                :api-upload-src="getUploadImageUrl($oc(data).id())"
                                @complete="onUploadImageComplete"
                            />
                        </k-col-label>
                    </v-row>

                    <v-row>
                        <k-col-label
                            :label="$mfl('user', 'username')"
                            :empty="!loading && !$oc(data).user.username()"
                        >
                            {{ $oc(data).user.username('~') }}
                        </k-col-label>

                        <k-col-label
                            :label="$mfl('organization_user', 'enabled')"
                            content-width="40"
                            :empty="!loading && !$oc(data).enabled()"
                        >
                            <v-switch
                                disabled
                                hide-details
                                class="ma-0"
                                v-model="$oc(data).enabled()"
                            />
                        </k-col-label>
                    </v-row>

                    <v-row>
                        <k-col-label
                            :edit-mode="editPassword"
                            :label="$t('views.settings-organization-user.password')"
                        >
                            <change-password
                                :user-id="$oc(data).id()"
                            />
                        </k-col-label>
                    </v-row>
                </k-card-section>

                <k-card-section
                    locked
                    :title="$t('security')"
                >
                    <v-row>
                        <k-col-label
                            :label="$mpl('role')"
                            :empty="!loading && 0 === $oc(data).roles([]).length"
                        >
                            <span
                                v-if="0 === $oc(data).roles([]).length"
                            >
                                ~
                            </span>

                            <v-chip
                                v-else
                                v-for="role in $oc(data).roles([])"
                                :key="role"
                                class="mr-1 mb-1"
                            >
                                {{ role }}
                            </v-chip>
                        </k-col-label>

                        <k-col-label
                            :label="$mpl('group')"
                            :empty="!loading && 0 === $oc(data).groups([]).length"
                        >
                            <span
                                v-if="0 === $oc(data).groups([]).length"
                            >
                                ~
                            </span>

                            <v-chip
                                v-else
                                v-for="group in $oc(data).groups([])"
                                :key="$oc(group).name()"
                                class="mr-1 mb-1"
                            >
                                {{ $oc(group).label($oc(group).name('~')) }}
                            </v-chip>
                        </k-col-label>
                    </v-row>
                </k-card-section>

                <k-card-section-system
                    metadata="organization_user"
                    :data="data"
                    :user-track="false"
                    :locked="editMode"
                    v-if="!isCreate"
                />
            </template>
        </k-standard-view>
    </v-container>
</template>
