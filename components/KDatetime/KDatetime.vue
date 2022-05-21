<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-text
        v-bind="$attrs"
        v-on="$listeners"
        :value="genValue"
        :default-value="defaultValue"
    >
        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
            <slot :name="slotItem.original" v-bind="props"/>
        </template>
    </k-text>
</template>

<script lang="ts">
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KDatetime extends mixins(
    SlotWrapper,
) {
    @Prop({type: String, default: 'datetime'})
    public type!: string;

    @Prop({type: String, default: '~'})
    public defaultValue!: string;

    private get genValue(): any {
        switch (this.type) {
            case 'date':
                return this.$date(this.$attrs.value);
            case 'time':
                return this.$time(this.$attrs.value);
            case 'datetime':
            default:
                return this.$datetime(this.$attrs.value);
        }
    }
}
</script>
