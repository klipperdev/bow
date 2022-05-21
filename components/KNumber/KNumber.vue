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
export default class KNumber extends mixins(
    SlotWrapper,
) {
    @Prop({type: String, default: 'number', validator: (value: string) => {
        return -1 !== ['number', 'percent', 'currency'].indexOf(value);
    }})
    public type!: string;

    @Prop({type: Number, default: undefined})
    public scale!: number;

    @Prop({type: [String, Boolean], default: undefined})
    public currency!: string|boolean|undefined;

    @Prop({type: Boolean, default: undefined})
    public percent!: boolean;

    @Prop({type: String, default: undefined})
    public display!: string;

    private get genValue(): string|undefined {
        let type = this.percent ? 'percent' : this.type;
        let currency = this.currency;

        if (true === currency || '' === currency) {
            type = 'currency';
            currency = undefined;
        } else if (false === currency) {
            currency = undefined;
        }

        switch (type) {
            case 'percent':
                return this.$percent(this.$attrs.value, this.scale);
            case 'currency':
                return this.$currency(this.$attrs.value, this.scale, currency, this.display);
            case 'number':
            default:
                return this.$number(this.$attrs.value, this.scale);
        }
    }
}
</script>
