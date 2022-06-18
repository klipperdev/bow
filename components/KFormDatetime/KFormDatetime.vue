<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-form-text
        ref="text"
        :id="'datetime_picker_' + _uid"
        v-bind="$attrs"
        v-on="$listeners"
        readonly
        clearable
        v-model="formattedValue"
        @click="open = !open"
    >
        <template v-slot:append-outer>
            <v-btn
                icon
                class="ma-0 mt-n2 ml-n2"
                @click="open = !open"
            >
                <v-icon color="primary">
                    {{ $attrs['append-inner-icon'] ? $attrs['append-inner-icon'] : 'fa-fw fa-calendar-day' }}
                </v-icon>
            </v-btn>

            <v-menu
                v-model="open"
                :activator="'#datetime_picker_' + _uid"
                :open-on-click="false"
                :close-on-content-click="false"
                transition="slide-y-transition"
                offset-y
                min-width="290px"
                max-width="290px"
                @input="open = false"
            >
                <v-date-picker
                    v-if="open"
                    v-model="pickerDateValue"
                    :locale="$store.state.i18n.locale + '-' + $store.state.i18n.locale"
                    no-title
                    scrollable
                    show-week
                    :locale-first-day-of-year="1"
                    :first-day-of-week="1"
                    @change="open = false"
                ></v-date-picker>
            </v-menu>
        </template>

        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
            <slot :name="slotItem.original" v-bind="props"/>
        </template>
    </k-form-text>
</template>

<script lang="ts">
import {formable} from '@klipper/bow/composables/mixins/formable';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import moment from 'moment';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    inheritAttrs: false,
})
export default class KFormDatetime extends mixins(
    SlotWrapper,
    formable('text'),
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

    /**
     * @param value
     */
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

            if (!!this.value && 'date' === this.outputType) {
                mPreviousValue.utcOffset(0, true);
            }

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
</script>
