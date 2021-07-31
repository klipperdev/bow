<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./KFormDatetime.ts" />

<template>
    <k-form-text
        ref="text"
        :id="'datetime_picker_' + self._uid"
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
                :activator="'#datetime_picker_' + self._uid"
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
                    :locale="self.$store.state.i18n.locale + '-' + self.$store.state.i18n.locale"
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
