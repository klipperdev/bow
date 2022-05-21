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
            <k-link-url
                ref="read"
                v-bind="genViewProps"
                v-on="genViewListeners"
                :src="fieldValue"
                :default-value="defaultValue"
            >
                <template v-for="slotItem in getSlotItems('view')" v-slot:[slotItem.target]="props">
                    <slot :name="slotItem.original" v-bind="props"/>
                </template>
            </k-link-url>
        </template>

        <template v-slot:edit>
            <k-form-url
                ref="edit"
                v-model="fieldValue"
                v-bind="genFieldEditProps"
                v-on="genEditListeners"
            >
                <template v-for="slotItem in getSlotItems('form')" v-slot:[slotItem.target]="props">
                    <slot :name="slotItem.original" v-bind="props"/>
                </template>
            </k-form-url>
        </template>

        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
            <slot :name="slotItem.original" v-bind="props"/>
        </template>
    </k-col-label>
</template>

<script lang="ts">
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {StandardViewFieldable} from '@klipper/bow/mixins/StandardViewFieldable';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KStandardViewFieldUrl extends mixins(
    StandardViewFieldable,
    SlotWrapper,
) {
    @Prop({type: Boolean, default: false})
    public noProtocol!: boolean;

    protected get genFieldEditProps(): Dictionary<any> {
        return Object.assign({
            'no-protocol': this.noProtocol,
        }, this.genEditProps);
    }
}
</script>
