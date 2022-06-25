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
        <template v-slot:loading>
            <k-user-avatar
                :size="38"
                vertical-adjust
                label
                loading
            />
        </template>

        <template v-slot:read>
            <k-user-avatar
                v-if="!isMultiple"
                ref="read"
                v-bind="genViewProps"
                v-on="genViewListeners"
                :size="38"
                vertical-adjust
                label
                :user="fieldValue"
            >
                <template v-for="slotItem in getSlotItems('view')" v-slot:[slotItem.target]="props">
                    <slot :name="slotItem.original" v-bind="props"/>
                </template>
            </k-user-avatar>

            <k-user-avatar
                v-else
                ref="read"
                v-bind="genViewProps"
                v-on="genViewListeners"
                :size="38"
                vertical-adjust
                label
                :user="item"
                v-for="item in fieldValue"
                :key="typeof item === 'object' ? item[itemValue] : item"
                class="mr-1 mb-1"
            >
                <template v-for="slotItem in getSlotItems('view')" v-slot:[slotItem.target]="props">
                    <slot :name="slotItem.original" v-bind="props"/>
                </template>
            </k-user-avatar>
        </template>

        <template v-slot:edit>
            <k-form-association-user
                ref="edit"
                v-model="fieldValue"
                v-bind="genEditProps"
                v-on="genEditListeners"
                :filled="undefined === genEditProps.filled ? true : genEditProps.filled"
            >
                <template v-for="slotItem in getSlotItems('form')" v-slot:[slotItem.target]="props">
                    <slot :name="slotItem.original" v-bind="props"/>
                </template>
            </k-form-association-user>
        </template>

        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
            <slot :name="slotItem.original" v-bind="props"/>
        </template>
    </k-col-label>
</template>

<script lang="ts">
import {ajaxSelectFormable} from '@klipper/bow/composables/mixins/formable';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {StandardViewAssociationable} from '@klipper/bow/mixins/StandardViewAssociationable';
import {mixins} from 'vue-class-component';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KStandardViewFieldAssociationUser extends mixins(
    StandardViewAssociationable,
    SlotWrapper,
    ajaxSelectFormable('edit'),
) {
}
</script>
