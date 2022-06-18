<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div
        class="v-toolbar--content"
    >
        <v-spacer/>

        <k-search-field
            prefix="k-data-kanban-search"
            flat
            solo-inverted
            hide-details
            clearable
            prepend-inner-icon="search"
            :label="$t('search')"
            color="primary lighten-2"
            rounded
        />

        <v-spacer/>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KDataKanbanSearchField extends Vue {
}
</script>
