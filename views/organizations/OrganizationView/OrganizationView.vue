<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-standard-view
        ref="sdtView"
        metadata="organization"
        :fetch-request="fetchRequest"
        :push-request="pushRequest"
        :delete-request="deleteRequest"
        @created="$router.replace({name: 'user-organization', params: {id: $oc($event).id()}})"
        @deleted="$router.replace('/')"
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

<script lang="ts">
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {StandardDeleteRequestDataEvent} from '@klipper/bow/http/event/StandardDeleteRequestDataEvent';
import {StandardFetchRequestDataEvent} from '@klipper/bow/http/event/StandardFetchRequestDataEvent';
import {StandardPushRequestDataEvent} from '@klipper/bow/http/event/StandardPushRequestDataEvent';
import {Component, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class OrganizationView extends Vue {
    private async fetchRequest(event: StandardFetchRequestDataEvent): Promise<Dictionary<any>|null> {
        return await this.$api.request({
            method: 'GET',
            url: '/user/organizations/' + event.id,
        }, event.canceler);
    }

    private async pushRequest(event: StandardPushRequestDataEvent): Promise<Dictionary<any>|null> {
        return await this.$api.request({
            method: event.getMethod(),
            url: event.getPushUrl('/user/organizations'),
            data: event.dataTransformed,
        }, event.canceler);
    }

    private async deleteRequest(event: StandardDeleteRequestDataEvent): Promise<void> {
        await this.$api.request({
            url: '/user/organizations/' + event.id,
            method: 'DELETE',
        }, event.canceler);
    }
}
</script>
