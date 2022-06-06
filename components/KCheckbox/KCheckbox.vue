<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-icon
        v-bind="genProps"
        v-on="$listeners"
    >
        <slot name="default">
            {{ genIcon }}
        </slot>
    </v-icon>
</template>

<script lang="ts">
import {Colorable} from '@klipper/bow/composables/mixins/colorable';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {defineComponent} from '@vue/composition-api';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default defineComponent({
    name: 'KCheckbox',

    mixins: [
        Colorable,
    ],

    props: {
        value: {
            type: Boolean,
            default: false,
        },

        checkedColor: {
            type: String,
            default: 'accent',
        },

        uncheckedColor: {
            type: String,
            default: 'grey-blue',
        },

        checkedIcon: {
            type: String,
            default: 'check_box',
        },

        uncheckedIcon: {
            type: String,
            default: 'check_box_outline_blank',
        },
    },

    computed: {
        classes(): object {
            return {
                'k-checkbox': true,
                'mt-n1': true,
                ...this.textColorClasses,
            };
        },

        styles(): object {
            return {
                ...this.textColorStyles,
            };
        },

        genIcon(): string {
            return this.value ? this.checkedIcon : this.uncheckedIcon;
        },

        genProps(): Dictionary<any> {
            return Object.assign({
                class: this.classes,
                style: this.styles,
                color: this.value ? this.checkedColor : this.uncheckedColor,
            }, this.$attrs);
        },
    },
});
</script>
