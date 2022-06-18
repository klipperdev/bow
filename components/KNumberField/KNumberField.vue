<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-text-field
        ref="text"
        v-bind="textAttrs"
        v-on="textListeners"
        v-model="formattedValue"
        @change="onChange"
    >
        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]>
            <slot :name="slotItem.original"/>
        </template>
    </v-text-field>
</template>

<script lang="ts">
import {formable} from '@klipper/bow/composables/mixins/formable';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {RuleValidate} from '@klipper/bow/validator/Rule';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    inheritAttrs: false,
})
export default class KNumberField extends mixins(
    SlotWrapper,
    formable('text')
) {
    @Prop({type: Number})
    public scale!: number;

    private get textAttrs(): any {
        const $attrs = Object.assign({}, this.$attrs);
        delete $attrs.value;
        const rules = Array.isArray(this.$attrs.rules) ? this.$attrs.rules as RuleValidate[] : [] as RuleValidate[];

        rules.push(this.$r('number'));

        return Object.assign({
            type: 'text',
            rules,
        }, $attrs);
    }

    private get textListeners(): any {
        const $listeners = Object.assign({}, this.$listeners);
        delete $listeners.input;

        return $listeners;
    }

    protected get formattedValue(): string|undefined {
        return typeof (this.$attrs.value as any) === 'number' ? this.$numberFormatter.number(this.$attrs.value, this.scale) : undefined;
    }

    /**
     * @param value
     */
    protected set formattedValue(value: string|undefined) {
        // Only emit the input event on change event
    }

    private onChange(value?: string) {
        this.$emit('input', this.$numberFormatter.parseNumber(value, this.scale));
    }
}
</script>
