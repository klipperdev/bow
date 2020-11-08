<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./OrganizationView.ts" />

<template>
    <v-container>
        <k-standard-view
            ref="sdtView"
            metadata="organization"
            :fetch-request="fetchRequest"
            :push-request="pushRequest"
            :delete-request="deleteRequest"
            @created="onCreated"
            @deleted="onDeleted"
        >
            <template
                v-slot:header="{data, isCreate}"
            >
                <k-standard-view-title-icon
                    icon="fa fa-fw fa-building"
                />

                <k-standard-view-title
                    :title="$oc(data).label()"
                    :default-title="$t('new')"
                />
            </template>

            <template
                v-slot:standardActions="{data, loading, enableEdit}"
            >
                <v-btn
                    outlined
                    :disabled="loading"
                    @click="enableEdit()"
                >
                    <v-icon>
                        edit
                    </v-icon>
                </v-btn>
            </template>

            <template
                v-slot:card="{data, loading, push, editMode, fieldErrors}"
            >
                <k-card-section
                    locked
                >
                    <v-row>
                        <k-col-label
                            :label="$mfl('organization', 'label')"
                            :edit-mode="editMode"
                            edit-label-required
                            :empty="!loading && !$oc(data).label()"
                        >
                            {{ $oc(data).label('~') }}

                            <template
                                v-slot:edit
                            >
                                <v-text-field
                                    type="text"
                                    dense
                                    filled
                                    name="label"
                                    v-model="data.label"
                                    autofocus
                                    :error-messages="fieldErrors('label')"
                                    @keydown.enter="push"
                                    :disabled="loading"
                                    :rules="[$r('required')]"
                                />
                            </template>
                        </k-col-label>

                        <k-col-label
                            :label="$mfl('organization', 'name')"
                            :edit-mode="editMode"
                            edit-label-required
                            :empty="!loading && !$oc(data).name()"
                        >
                            {{ $oc(data).name('~') }}

                            <template
                                v-slot:edit
                            >
                                <v-text-field
                                    type="text"
                                    dense
                                    filled
                                    name="name"
                                    v-model="data.name"
                                    :error-messages="fieldErrors('name')"
                                    @keydown.enter="push"
                                    :disabled="loading"
                                    :rules="[$r('required')]"
                                />
                            </template>
                        </k-col-label>
                    </v-row>
                </k-card-section>
            </template>
        </k-standard-view>
    </v-container>
</template>
