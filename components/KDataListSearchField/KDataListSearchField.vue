<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div class="v-toolbar--content">
        <v-spacer></v-spacer>

        <k-search-field prefix="k-data-list-search"></k-search-field>

        <v-spacer></v-spacer>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KDataListSearchField extends Vue {
    }
</script>
