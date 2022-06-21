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
import {SlotWrapper} from '@klipper/bow/composables/mixins/slotWrapper';
import {defineComponent} from '@vue/composition-api';
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
                return this.value;
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
        }
    },
});
</script>
