<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-card
        ref="card"
        class="k-kanban-card"
        v-bind="$attrs"
        v-on="$listeners"
    >
        <template v-slot:loading>
            <slot name="loading"/>
        </template>

        <template v-slot:default>
            <slot name="default"/>
        </template>
    </v-card>
</template>

<style lang="scss" src="./KKanbanCard.scss" />

<script lang="ts">
import {inject as RegistrableInject} from '@klipper/bow/mixins/Registrable';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {mixins} from 'vue-class-component';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    inheritAttrs: false,
})
export default class KKanbanCard extends mixins(
    SlotWrapper,
    RegistrableInject<'kanbanColumn', any>('kanbanColumn'),
) {
}
</script>
