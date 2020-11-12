<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KStandardViewFieldPersonFullName.ts" />

<template>
    <k-col-label
        :label="$mfl('contact', 'full_name')"
        :edit-mode="standardData.editMode"
        edit-label-required
    >
        <template v-slot:read>
            {{ getName(standardData.data) }}

            <v-btn
                v-if="!!$oc(standardData.data).personal_account_id()"
                small icon depressed
                color="accent"
                class="ml-2 mt-n1"
                :to="{name: 'account', params: {org: $org, id: $oc(standardData.data).personal_account_id()}}"
            >
                <v-icon
                    small
                >
                    fa fa-fw fa-building
                </v-icon>
            </v-btn>
        </template>

        <template v-slot:edit>
            <v-row>
                <v-col
                    cols="12"
                    xl="3"
                    class="pt-0 pb-O"
                >
                    <k-standard-view-field-association-choice
                        name="salutation"
                        unwrap
                    />
                </v-col>

                <v-col
                    cols="12"
                    md="6"
                    xl="4"
                    class="pt-0 pb-O"
                >
                    <k-standard-view-field-text
                        name="first_name"
                        unwrap
                        autofocus
                    />
                </v-col>

                <v-col
                    cols="12"
                    md="6"
                    xl="5"
                    class="pt-0 pb-O"
                >
                    <k-standard-view-field-text
                        name="last_name"
                        unwrap
                    />
                </v-col>
            </v-row>
        </template>
    </k-col-label>
</template>
