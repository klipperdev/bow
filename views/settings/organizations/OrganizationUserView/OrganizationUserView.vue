<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./OrganizationUserView.ts" />

<template>
    <!-- Invite pr create an organization user -->
    <organization-user-view-invitation
        v-if="isInvitation"
        key="userInvitation"
        @invited="onInvited"
        @invalid="onInvalid"
    />

    <!-- Update organization user -->
    <v-container
        v-else
        key="userForm"
    >
        <k-standard-view
            ref="sdtView"
            metadata="organization_user"
            :data-model-transformer="dataTransformer"
            :push-request="createMode ? createPushRequest : undefined"
            @created="onCreated"
            @deleted="onDeleted"
        >
            <template v-slot:header="{data}">
                <k-standard-view-title :title="$oc(data).user.full_name($oc(data).user.username())"/>
            </template>

            <template v-slot:card="{isCreate, data, loading, push, editMode, currentLocale, fieldErrors}">
                <k-standard-view-section locked>
                    <v-row>
                        <k-col-label
                            :label="$mfl('user', 'full_name')"
                            :edit-mode="editMode"
                        >
                            <template v-slot:read>
                                {{ $oc(data).user.full_name('~') }}
                            </template>

                            <template v-slot:edit>
                                <v-row>
                                    <v-col cols="12" md="6" class="pt-0 pb-0">
                                        <k-standard-view-field-text
                                            metadata="user"
                                            name="first_name"
                                            property-path="user.first_name"
                                            unwrap
                                            autofocus
                                        />
                                    </v-col>

                                    <v-col cols="12" md="6" class="pt-0 pb-0">
                                        <k-standard-view-field-text
                                            metadata="user"
                                            name="last_name"
                                            property-path="user.last_name"
                                            unwrap
                                        />
                                    </v-col>
                                </v-row>
                            </template>
                        </k-col-label>

                        <k-standard-view-field-switch
                            name="enabled"
                            :disabled="!!$store.state.account.user && $oc(data).user.id() === $store.state.account.user.id"
                        />
                    </v-row>

                    <v-row>
                        <k-standard-view-field-email
                            metadata="user"
                            name="email"
                            property-path="user.email"
                        />

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

                    <v-divider/>

                    <v-row>
                        <k-standard-view-field-text
                            metadata="user"
                            name="username"
                            property-path="user.username"
                            :required="false"
                        />

                        <k-col-label
                            :edit-mode="editPassword || createMode"
                            :label="$t('views.settings-organization-user.password')"
                            :edit-label-required="createMode"
                        >
                            <change-password
                                v-if="!!$oc(data).id()"
                                :disabled="editMode"
                                :user-id="$oc(data).id()"
                            />

                            <template v-slot:edit>
                                <k-form-text
                                    v-model="createPassword"
                                    :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                                    :type="showPassword ? 'text' : 'password'"
                                    @click:append="showPassword = !showPassword"
                                    @keydown.enter="push"
                                    clearable
                                    :disabled="loading"
                                    :rules="[$r('required')]"
                                />
                            </template>
                        </k-col-label>
                    </v-row>

                    <v-row>
                        <k-standard-view-field-text
                            metadata="user"
                            name="alias"
                            property-path="user.alias"
                        />

                        <k-standard-view-field-text
                            metadata="user"
                            name="initial"
                            property-path="user.initial"
                        />
                    </v-row>
                </k-standard-view-section>

                <k-standard-view-section :title="$t('security')" locked>
                    <v-row>
                        <k-standard-view-field-association-choice
                            name="roles"
                            :edit-props="{
                                'return-object': false,
                                fields: ['name'],
                                filters: {field: 'name', operator: 'not_in', value: ['ROLE_USER', 'ROLE_ORGANIZATION_USER']},
                            }"
                        />

                        <k-standard-view-field-association-choice
                            name="groups"
                            :edit-props="{
                                fields: ['id'],
                                filters: undefined
                            }"
                        />
                    </v-row>

                    <v-row>
                        <k-standard-view-field-association-choice
                            name="roles"
                            :label="$t('views.settings-organization-user.roles')"
                            property-path="user.roles"
                            :edit-props="{
                                'return-object': false,
                                fields: ['name'],
                                filters: {condition: 'AND',rules: [{field: 'name', operator: 'in', value: ['ROLE_INTERNAL_USER']}]},
                            }"
                        />
                    </v-row>
                </k-standard-view-section>

                <k-standard-view-section-system/>
            </template>
        </k-standard-view>
    </v-container>
</template>
