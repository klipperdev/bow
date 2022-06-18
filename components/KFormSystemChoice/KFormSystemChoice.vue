<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-select-system-choice
        ref="selectChoice"
        v-bind="$attrs"
        v-on="$listeners"
    >
        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
            <slot :name="slotItem.original" v-bind="props"/>
        </template>
    </k-select-system-choice>
</template>

<script lang="ts">
import {selectFormable} from '@klipper/bow/composables/mixins/formable';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {mixins} from 'vue-class-component';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KFormSystemChoice extends mixins(
    SlotWrapper,
    selectFormable('selectChoice'),
) {
}
</script>
