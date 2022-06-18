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
            v-if="'user' === $route.params.org"
            fab
            color="primary"
            fixed
            bottom
            right
            :to="{name: 'user-organization', params: {org: $org, id: 'create'}}"
        >
            <v-icon>
                add
            </v-icon>
        </v-btn>
    </v-fab-transition>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class OrganizationFabCreate extends Vue {
}
</script>
