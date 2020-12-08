<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./OrganizationRoleView.ts" />

<template>
    <v-container>
        <k-standard-view
            metadata="role"
            @created="$router.replace({name: 'settings-org-role', params: {id: $oc($event).id()}})"
            @deleted="$router.replace({name: 'settings-org-roles'})"
        >
            <template v-slot:header>
                <k-standard-view-title :prefix="$ml('role')"/>
            </template>

            <template v-slot:card="{data}">
                <k-standard-view-section locked>
                    <v-row>
                        <k-standard-view-field-text name="label" autofocus/>
                        <k-standard-view-field-text name="name"/>
                    </v-row>

                    <v-row>
                        <k-standard-view-field-association-choice
                            name="children"
                            :edit-props="{
                                fields: ['id'],
                                filters: $oc(data).id() ? {field: 'id', operator: 'not_equal', value: $oc(data).id()} : undefined
                            }"
                        />
                    </v-row>
                </k-standard-view-section>

                <k-standard-view-section-system/>
            </template>
        </k-standard-view>
    </v-container>
</template>
