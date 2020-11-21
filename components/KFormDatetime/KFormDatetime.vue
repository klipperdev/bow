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
        :id="'datetime_picker_' + _uid"
        v-bind="$attrs"
        v-on="$listeners"
        readonly
        clearable
        v-model="formattedValue"
        @click="open = !open"
    >
        <template v-slot:prepend>
            <v-btn
                icon
                class="ma-0 mt-n2 ml-n2"
                @click="open = !open"
            >
                <v-icon color="accent">
                    {{ $attrs['prepend-inner-icon'] ? $attrs['prepend-inner-icon'] : 'fa-fw fa-calendar-day' }}
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
                    v-model="date"
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
