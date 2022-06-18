<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-col-label
        v-bind="genColLabelProps"
        v-on="genColLabelListeners"
    >
        <template v-slot:read>
            <k-checkbox
                ref="read"
                v-bind="genViewProps"
                v-on="genViewListeners"
                :value="fieldValue"
            >
                <template v-for="slotItem in getSlotItems('view')" v-slot:[slotItem.target]="props">
                    <slot :name="slotItem.original" v-bind="props"/>
                </template>
            </k-checkbox>
        </template>

        <template v-slot:edit>
            <v-checkbox
                ref="edit"
                v-model="fieldValue"
                v-bind="genEditProps"
                v-on="genEditListeners"
                color="primary"
                class="ma-0"
            >
                <template v-for="slotItem in getSlotItems('form')" v-slot:[slotItem.target]>
                    <slot :name="slotItem.original"/>
                </template>
            </v-checkbox>
        </template>

        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
            <slot :name="slotItem.original" v-bind="props"/>
        </template>
    </k-col-label>
</template>

<script lang="ts">
import {formable} from '@klipper/bow/composables/mixins/formable';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {StandardViewFieldable} from '@klipper/bow/mixins/StandardViewFieldable';
import {mixins} from 'vue-class-component';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KStandardViewFieldCheckbox extends mixins(
    StandardViewFieldable,
    SlotWrapper,
    formable('edit'),
) {
}
</script>
