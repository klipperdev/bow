<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-standard-view
        metadata="group"
        @created="self.$router.replace({name: 'settings-org-group', params: {id: self.$oc($event).id()}})"
        @deleted="self.$router.replace({name: 'settings-org-groups'})"
    >
        <template v-slot:header>
            <k-standard-view-title :prefix="self.$ml('group')"/>
        </template>

        <template v-slot:card="{data}">
            <k-standard-view-section locked>
                <v-row>
                    <k-standard-view-field-text name="label" autofocus/>
                    <k-standard-view-field-text name="name"/>
                </v-row>

                <v-row>
                    <k-standard-view-field-association
                        name="roles"
                        route="settings-org-role"
                        :edit-props="{
                            'return-object': false,
                            fields: ['name'],
                            filters: self.$oc(data).id() ? {field: 'name', operator: 'not_equal', value: 'ROLE_USER'} : undefined
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
import ChangePassword from '@klipper/bow/views/settings/organizations/ChangePassword/ChangePassword.vue';
import {mixins} from 'vue-class-component';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    components: {
        ChangePassword,
    },
})
export default class OrganizationGroupView extends mixins(
    Selfable,
) {
}
</script>
