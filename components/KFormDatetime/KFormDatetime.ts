/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {DateFormatter} from '@klipper/bow/i18n/DateFormatter';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {mixins} from 'vue-class-component';
import {Component, Prop, Watch} from 'vue-property-decorator';
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

    private open: boolean = false;

    private date: string|null = null;

    protected get formattedValue(): string|undefined {
        switch (this.type) {
            case 'date':
                return (this.$dateFormatter as DateFormatter).date(this.$attrs.value);
            case 'time':
            case 'datetime':
            default:
                return this.$dateFormatter.dateTime(this.$attrs.value);
        }
    }

    protected set formattedValue(value: string|undefined) {
        if (!value) {
            this.date = null;
        }
    }

    public mounted(): void {
        if (this.$attrs.value) {
            if (this.$i18n) {
                moment.locale(this.$i18n.locale);
            }

            this.date = moment(this.$attrs.value, undefined).format('YYYY-MM-DD');
        }
    }

    @Watch('date')
    private watchDate(value?: any): void {
        let validValue: string|null;
        let type = this.type;

        if (this.outputType && ['datetime', 'date', 'time'].includes(this.outputType)) {
            type = this.outputType;
        }

        switch (type) {
            case 'date':
                validValue = value ? value : null;
                break;
            case 'time':
            case 'datetime':
            default:
                validValue = value ? value + ' 00:00:00' : null;
                break;
        }

        this.$emit('input', validValue);
    }
}
