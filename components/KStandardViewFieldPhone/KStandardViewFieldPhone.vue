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
            <k-link-phone
                ref="read"
                v-bind="genViewProps"
                v-on="genViewListeners"
                :src="fieldValue"
                :defaultValue="defaultValue"
                :tel-icon="'phone' === type"
                :sms-icon="'mobile' === type"
                :fax-icon="'fax' === type"
            >
                <template v-for="slotItem in getSlotItems('view')" v-slot:[slotItem.target]="props">
                    <slot :name="slotItem.original" v-bind="props"/>
                </template>
            </k-link-phone>
        </template>

        <template v-slot:edit>
            <k-form-phone
                ref="edit"
                v-model="fieldValue"
                v-bind="genEditProps"
                v-on="genEditListeners"
                :type="type"
            >
                <template v-for="slotItem in getSlotItems('form')" v-slot:[slotItem.target]="props">
                    <slot :name="slotItem.original" v-bind="props"/>
                </template>
            </k-form-phone>
        </template>

        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
            <slot :name="slotItem.original" v-bind="props"/>
        </template>
    </k-col-label>
</template>

<script lang="ts">
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {StandardViewFieldable} from '@klipper/bow/mixins/StandardViewFieldable';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KStandardViewFieldPhone extends mixins(
    StandardViewFieldable,
    SlotWrapper,
) {
    @Prop({type: String, default: 'phone', validator: (value: string) => {
        return -1 !== ['phone', 'mobile', 'fax'].indexOf(value);
    }})
    public type!: string;
}
</script>
