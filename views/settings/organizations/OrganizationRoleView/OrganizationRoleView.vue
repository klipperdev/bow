<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-standard-view
        metadata="role"
        @created="self.$router.replace({name: 'settings-org-role', params: {id: self.$oc($event).id()}})"
        @deleted="self.$router.replace({name: 'settings-org-roles'})"
    >
        <template v-slot:header>
            <k-standard-view-title :prefix="self.$ml('role')"/>
        </template>

        <template v-slot:card="{data}">
            <k-standard-view-section locked>
                <v-row>
                    <k-standard-view-field-text name="label" autofocus/>
                    <k-standard-view-field-text name="name"/>
                </v-row>

                <v-row>
                    <k-standard-view-field-association
                        name="children"
                        route="settings-org-role"
                        :edit-props="{
                            fields: ['id'],
                            filters: self.$oc(data).id() ? {field: 'id', operator: 'not_equal', value: self.$oc(data).id()} : undefined
                        }"
                    />
                </v-row>
            </k-standard-view-section>

            <k-standard-view-section-system/>
        </template>
    </k-standard-view>
</template>

<script lang="ts">
import {Selfable} from '@klipper/bow/mixins/Selfable';
import {mixins} from 'vue-class-component';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class OrganizationRoleView extends mixins(
    Selfable,
) {
}
</script>
