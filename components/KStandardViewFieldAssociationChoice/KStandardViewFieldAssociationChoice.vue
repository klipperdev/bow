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
            <span v-if="isMultiple && isEmpty">{{ defaultValue }}</span>

            <k-choice-chip
                v-else-if="!isMultiple"
                ref="read"
                v-bind="genViewProps"
                v-on="genViewListeners"
                :choice="fieldValue"
            >
                <template v-for="slotItem in getSlotItems('view')" v-slot:[slotItem.target]="props">
                    <slot :name="slotItem.original" v-bind="props"/>
                </template>
            </k-choice-chip>

            <k-choice-chip
                v-else
                ref="read"
                v-bind="genViewProps"
                v-on="genViewListeners"
                v-for="item in fieldValue"
                :key="typeof item === 'object' ? item[itemValue] : item"
                class="mr-1 mb-1"
                :choice="item"
            >
                <template v-for="slotItem in getSlotItems('view')" v-slot:[slotItem.target]="props">
                    <slot :name="slotItem.original" v-bind="props"/>
                </template>
            </k-choice-chip>
        </template>

        <template v-slot:edit>
            <k-form-association-choice
                ref="edit"
                v-model="fieldValue"
                v-bind="genAssociationChoiceEditProps"
                v-on="genEditListeners"
                filled
            >
                <template v-for="slotItem in getSlotItems('form')" v-slot:[slotItem.target]="props">
                    <slot :name="slotItem.original" v-bind="props"/>
                </template>
            </k-form-association-choice>
        </template>

        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
            <slot :name="slotItem.original" v-bind="props"/>
        </template>
    </k-col-label>
</template>

<script lang="ts">
import {ajaxSelectFormable} from '@klipper/bow/composables/mixins/formable';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {StandardViewAssociationable} from '@klipper/bow/mixins/StandardViewAssociationable';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KStandardViewFieldAssociationChoice extends mixins(
    StandardViewAssociationable,
    SlotWrapper,
    ajaxSelectFormable('edit'),
) {
    @Prop({type: Boolean, default: undefined})
    public selectFirst!: boolean;

    protected get genAssociationChoiceEditProps(): Dictionary<any> {
        const type = !!this.associationMetadata
        && !!this.associationMetadata.inputConfig.criteria
        && this.associationMetadata.inputConfig.criteria.type
            ? this.associationMetadata.inputConfig.criteria.type
            : '';

        return Object.assign({
            type,
            'select-first': undefined !== this.selectFirst ? this.selectFirst : undefined,
        }, this.genAssociationEditProps);
    }
}
</script>
