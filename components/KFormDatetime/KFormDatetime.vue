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
        v-model="formattedValue"
        @click="togglePicker"
    >
        <template v-slot:append-outer>
            <slot name="append-outer" v-bind="genBtnSlotProps">
                <v-btn
                    v-if="showIcon"
                    icon
                    class="ma-0 mt-n2 ml-n2"
                    @click="togglePicker"
                >
                    <v-icon color="primary">
                        {{ $attrs['append-inner-icon'] ? $attrs['append-inner-icon'] : 'fa-fw fa-calendar-day' }}
                    </v-icon>
                </v-btn>
            </slot>

            <v-dialog
                v-if="modalDialog"
                v-bind="genDialogProps"
                v-on="genDialogOn"
            >
                <slot
                    name="picker"
                    v-if="open"
                    v-bind="genPickerSlotProps"
                >
                    <v-date-picker
                        v-bind="genPickerProps"
                        v-on="genPickerOn"
                        full-width
                        scrollable
                        show-week
                    />
                </slot>
            </v-dialog>

            <v-menu
                v-else
                v-bind="genMenuProps"
                v-on="genMenuOn"
            >
                <slot
                    name="picker"
                    v-if="open"
                    v-bind="genPickerSlotProps"
                >
                    <v-date-picker
                        v-bind="genPickerProps"
                        v-on="genPickerOn"
                        no-title
                        full-width
                        scrollable
                        show-week
                    />
                </slot>
            </v-menu>
        </template>

        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
            <slot :name="slotItem.original" v-bind="props"/>
        </template>
    </k-form-text>
</template>

<script lang="ts">
import {formable} from '@klipper/bow/composables/mixins/formable';
import {SlotWrapper} from '@klipper/bow/composables/mixins/slotWrapper';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {defineComponent, PropType} from '@vue/composition-api';
import moment from 'moment';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default defineComponent({
    name: 'KFormDatetime',

    inheritAttrs: false,

    mixins: [
        SlotWrapper,
        formable('text'),
    ],

    props: {
        type: {
            type: String,
            default: 'datetime',
        },

        outputType: {
            type: String,
            default: undefined,
        },

        value: {
            type: String,
        },

        showIcon: {
            type: Boolean,
            default: false,
        },

        keepOpen: {
            type: Boolean,
            default: false,
        },

        modalDialog: {
            type: Boolean,
            default: false,
        },

        modalProps: {
            type: Object as PropType<Dictionary<any>>,
            default: () => ({}),
        },

        modalOn: {
            type: Object as PropType<Dictionary<any>>,
            default: () => ({}),
        },

        pickerProps: {
            type: Object as PropType<Dictionary<any>>,
            default: () => ({}),
        },

        pickerOn: {
            type: Object as PropType<Dictionary<any>>,
            default: () => ({}),
        },
    },

    data() {
        return {
            open: false as boolean,
        };
    },

    computed: {
        formattedValue: {
            get(): string|undefined {
                switch (this.type) {
                    case 'date':
                        return this.$dateFormatter.date(this.value);
                    case 'time':
                    case 'datetime':
                    default:
                        return this.$dateFormatter.dateTime(this.value);
                }
            },

            set(value: string|undefined) {
                // Skip setter for formatted value
            },
        },

        pickerDateValue: {
            get(): string|undefined {
                return moment(this.value).format('YYYY-MM-DD');
            },

            set(value: string|undefined) {
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
            },
        },

        genBtnSlotProps(): Dictionary<any> {
            return {
                openPicker: this.openPicker,
                closePicker: this.closePicker,
                togglePicker: this.togglePicker,
                setValue: this.setValue,
            };
        },

        genDialogProps(): Dictionary<any> {
            return Object.assign({
                value: this.open,
                'max-width': '290px',
            }, this.modalProps);
        },

        genDialogOn(): Dictionary<any> {
            return Object.assign({
                'input': (value: boolean) => {
                    this.open = value;
                },
            }, this.modalOn);
        },

        genMenuProps(): Dictionary<any> {
            return Object.assign({
                value: this.open,
                activator: '#datetime_picker_' + this._uid,
                'open-on-click': false,
                'close-on-content-click': false,
                transition: 'slide-y-transition',
                'offset-y': true,
                'min-width': '290px',
                'max-width': '290px',
            }, this.modalProps);
        },

        genMenuOn(): Dictionary<any> {
            return Object.assign({
                'input': (value: boolean) => {
                    this.open = value;
                    this.closePicker();
                },
            }, this.modalOn);
        },

        genPickerProps(): Dictionary<any> {
            return Object.assign({
                value: this.pickerDateValue,
                locale: this.$store.state.i18n.locale + '-' + this.$store.state.i18n.locale,
                'locale-first-day-of-year': 1,
                'first-day-of-week': 1,
                'full-width': true,
            }, this.pickerProps);
        },

        genPickerOn(): Dictionary<any> {
            return Object.assign({
                'input': (value: boolean) => {
                    this.pickerDateValue = value;
                },
                change: this.keepOpen ? () => {} : this.closePicker,
            }, this.pickerOn);
        },

        genPickerSlotProps(): Dictionary<any> {
            return {
                attrs: this.genPickerProps,
                on: this.genPickerOn,
                openPicker: this.openPicker,
                closePicker: this.closePicker,
                togglePicker: this.togglePicker,
                setValue: this.setValue,
            };
        },
    },

    methods: {
        setValue(value: string|null, format?: string): void {
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
        },

        openPicker(): void {
            this.open = true;
        },

        closePicker(): void {
            this.open = false;
        },

         togglePicker(): void {
            this.open = !this.open;
        },
    },
});
</script>
