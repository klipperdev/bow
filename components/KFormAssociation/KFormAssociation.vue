<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-select-association
        ref="select"
        v-bind="$attrs"
        v-on="$listeners"
    >
        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
            <slot :name="slotItem.original" v-bind="props"/>
        </template>
    </k-select-association>
</template>

<script lang="ts">
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {mixins} from 'vue-class-component';
import {Component} from 'vue-property-decorator';
import {ajaxSelectFormable} from '@klipper/bow/composables/mixins/formable';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KFormAssociation extends mixins(
    SlotWrapper,
    ajaxSelectFormable('select'),
) {
}
</script>
