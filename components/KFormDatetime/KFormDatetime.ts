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
import moment from 'moment';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    inheritAttrs: false,
})
export default class KFormDatetime extends mixins(
    SlotWrapper,
) {
    @Prop({type: String, default: 'datetime'})
    public type!: string;

    @Prop({type: String, default: undefined})
    public outputType!: string|undefined;

    @Prop()
    public value!: any;

    private open: boolean = false;

    protected get formattedValue(): string|undefined {
        switch (this.type) {
            case 'date':
                return this.$dateFormatter.date(this.value);
            case 'time':
            case 'datetime':
            default:
                return this.$dateFormatter.dateTime(this.value);
        }
    }

    protected set formattedValue(value: string|undefined) {
        // Skip setter for formatted value
    }

    protected get pickerDateValue(): string|undefined {
        return this.value;
    }

    protected set pickerDateValue(value: string|undefined) {
        if (value) {
            const mValue = moment(value);
            const mPreviousValue = !!this.value ? moment(this.value) : moment();

            mPreviousValue.date(mValue.date());
            mPreviousValue.month(mValue.month());
            mPreviousValue.year(mValue.year());

            value = mPreviousValue.toISOString();
        }

        this.setValue(value || null);
    }

    public setValue(value: string|null, format?: string): void {
        let validValue: string|null;
        let type = this.type;

        if (this.outputType && ['datetime', 'date', 'time'].includes(this.outputType)) {
            type = this.outputType;
        }

        switch (type) {
            case 'date':
                validValue = value ? moment(value, format).format('YYYY-MM-DD') : null;
                break;
            case 'time':
            case 'datetime':
            default:
                validValue = value ? moment(value, format).toISOString() : null;
                break;
        }

        this.$emit('input', validValue);
    }
}
