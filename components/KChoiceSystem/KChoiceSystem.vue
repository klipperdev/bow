<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-choice-chip
        v-bind="$attrs"
        v-on="$listeners"
        :choice="genValue"
    >
        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
            <slot :name="slotItem.original" v-bind="props"/>
        </template>
    </k-choice-chip>
</template>

<script lang="ts">
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KChoiceSystem extends mixins(
    SlotWrapper,
) {
    @Prop({type: String})
    public type!: string|undefined;

    private get genValue(): any {
        const value = this.$attrs.choice;

        if (!!this.type && !!value) {
            return this.$metadata.getSystemChoiceLabel(this.type, value);
        }

        return value;
    }
}
</script>
