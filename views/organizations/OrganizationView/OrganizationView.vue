<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./OrganizationView.ts" />

<template>
    <k-standard-view
        ref="sdtView"
        metadata="organization"
        :fetch-request="fetchRequest"
        :push-request="pushRequest"
        :delete-request="deleteRequest"
        @created="self.$router.replace({name: 'user-organization', params: {id: self.$oc($event).id()}})"
        @deleted="self.$router.replace('/')"
    >
        <template v-slot:header="{data, isCreate}">
            <k-standard-view-title/>
        </template>

        <template v-slot:card>
            <k-standard-view-section locked>
                <v-row>
                    <k-standard-view-field-text name="label" autofocus/>
                    <k-standard-view-field-text name="name"/>
                </v-row>
            </k-standard-view-section>
        </template>
    </k-standard-view>
</template>
