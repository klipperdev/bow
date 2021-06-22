/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
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
) {
    @Prop({type: Number})
    public scale!: number;

    private get textAttrs(): any {
        const $attrs = Object.assign({}, this.$attrs);
        delete $attrs.value;

        return Object.assign({
            type: 'text',
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
