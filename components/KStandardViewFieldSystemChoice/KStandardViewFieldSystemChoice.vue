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
            <k-choice-system
                v-if="!isMultiple"
                ref="read"
                v-bind="genViewProps"
                v-on="genViewListeners"
                :type="fieldSystemChoiceType"
                :choice="fieldValue"
            >
                <template v-for="slotItem in getSlotItems('view')" v-slot:[slotItem.target]="props">
                    <slot :name="slotItem.original" v-bind="props"/>
                </template>
            </k-choice-system>
        </template>

        <template v-slot:edit>
            <k-form-system-choice
                ref="edit"
                v-model="fieldValue"
                v-bind="genSystemChoiceEditProps"
                v-on="genEditListeners"
                filled
            >
                <template v-for="slotItem in getSlotItems('form')" v-slot:[slotItem.target]="props">
                    <slot :name="slotItem.original" v-bind="props"/>
                </template>
            </k-form-system-choice>
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
export default class KStandardViewFieldSystemChoice extends mixins(
    StandardViewFieldable,
    SlotWrapper,
) {
    @Prop({type: Boolean, default: undefined})
    public selectFirst!: boolean;

    private get isMultiple(): boolean {
        if (!this.objectMetadata) {
            return false;
        }

        return !!this.fieldSystemChoiceInputConfig && !!this.fieldSystemChoiceInputConfig.multiple;
    }

    private get fieldSystemChoiceInputConfig(): Dictionary<any>|undefined {
        if (!!this.fieldMetadata
                && 'choice' === this.fieldMetadata.input
                && typeof this.fieldMetadata.inputConfig.choices === 'string'
                && this.fieldMetadata.inputConfig.choices.startsWith('#/choices/')) {
            return this.fieldMetadata.inputConfig;
        }

        return undefined;
    }

    private get fieldSystemChoiceType(): string|undefined {
        return !!this.fieldSystemChoiceInputConfig
                && typeof this.fieldSystemChoiceInputConfig.choices === 'string'
            ? this.fieldSystemChoiceInputConfig.choices.substr(10)
            : undefined;
    }

    private get genSystemChoiceEditProps(): Dictionary<any> {
        return Object.assign({
            'type': this.fieldSystemChoiceType,
            'select-first': undefined !== this.selectFirst ? this.selectFirst : undefined,
        }, this.genEditProps);
    }
}
</script>
