<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./OrganizationGroupView.ts" />

<template>
    <v-container>
        <k-standard-view
            ref="sdtView"
            metadata="group"
            :fetch-request="fetchRequest"
            :push-request="pushRequest"
            :delete-request="deleteRequest"
            @created="onCreated"
            @deleted="onDeleted"
        >
            <template v-slot:header="{data}">
                <k-standard-view-title-icon
                    icon="group_work"
                    :icon-size="38"
                />

                <k-standard-view-title
                    :prefix="$ml('group')"
                    :title="$oc(data).label()"
                    :default-title="$t('new')"
                />
            </template>

            <template v-slot:card="{
                    isCreate,
                    data,
                    loading,
                    push,
                    editMode,
                    currentLocale,
                    fieldErrors
                }"
            >
                <k-card-section
                    locked
                >
                    <v-row>
                        <k-col-label
                            :label="$mfl('group', 'label')"
                            :edit-mode="editMode"
                            edit-label-required
                            :edit-translate="currentLocale"
                            :empty="!loading && !$oc(data).label()"
                        >
                            {{ $oc(data).label('~') }}

                            <template v-slot:edit>
                                <v-text-field
                                    type="text"
                                    dense
                                    filled
                                    name="label"
                                    v-model="data.label"
                                    autofocus
                                    :error-messages="fieldErrors('label')"
                                    :disabled="loading"
                                    :rules="[$r('required')]"
                                    @keydown.enter="push"
                                />
                            </template>
                        </k-col-label>

                        <k-col-label
                            :label="$mfl('group', 'name')"
                            :edit-mode="editMode"
                            edit-label-required
                            :empty="!loading && !$oc(data).name()"
                        >
                            {{ $oc(data).name('~') }}

                            <template v-slot:edit>
                                <v-text-field
                                    type="text"
                                    dense
                                    filled
                                    name="name"
                                    v-model="data.name"
                                    :error-messages="fieldErrors('name')"
                                    :disabled="loading"
                                    :rules="[$r('required')]"
                                    @keydown.enter="push"
                                />
                            </template>
                        </k-col-label>
                    </v-row>

                    <v-row>
                        <k-col-label
                            :label="$mpl('role')"
                            :edit-mode="editMode"
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
                                :key="typeof role === 'object' ? role['name'] : role"
                                class="mr-1 mb-1"
                            >
                                {{ role }}
                            </v-chip>

                            <template v-slot:edit>
                                <k-select-entity
                                    name="roles"
                                    v-model="data.roles"
                                    filled
                                    multiple
                                    target-metadata="role"
                                    :disabled="loading"
                                    :error-messages="fieldErrors('roles')"
                                    item-value="name"
                                    :fields="['name']"
                                    :filters="data.id ? {field: 'name', operator: 'not_equal', value: 'ROLE_USER'} : undefined"
                                />
                            </template>
                        </k-col-label>
                    </v-row>
                </k-card-section>

                <k-card-section-system
                    metadata="group"
                    :data="data"
                    :user-track="false"
                    :locked="editMode"
                    v-if="!isCreate"
                />
            </template>
        </k-standard-view>
    </v-container>
</template>
