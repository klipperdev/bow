<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-fab-transition
        mode="out-in"
    >
        <v-btn
            v-if="'user' === self.$route.params.org"
            fab
            color="primary"
            fixed
            bottom
            right
            :to="{name: 'user-organization', params: {org: self.$org, id: 'create'}}"
        >
            <v-icon>
                add
            </v-icon>
        </v-btn>
    </v-fab-transition>
</template>

<script lang="ts">
import {Selfable} from '@klipper/bow/mixins/Selfable';
import {mixins} from 'vue-class-component';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class OrganizationFabCreate extends mixins(
    Selfable,
) {
}
</script>
