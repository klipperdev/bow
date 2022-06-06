<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <span
        v-bind="$attrs"
        v-on="$listeners"
        :class="classes"
        :style="styles"
        v-html="genValue || defaultValue"
    >
        <slot name="default"/>
    </span>
</template>

<script lang="ts">
import {Colorable} from '@klipper/bow/composables/mixins/colorable';
import {Themeable} from '@klipper/bow/composables/mixins/themeable';
import {defineComponent} from '@vue/composition-api';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default defineComponent({
    name: 'KText',

    mixins: [
        Colorable,
        Themeable,
    ],

    props: {
        value: {
            type: [String, Number],
        },

        defaultValue: {
            type: String,
            default: '~',
        },

        prepend: {
            type: String,
        },

        append: {
            type: String,
        },
    },

    computed: {
        classes(): object {
            return {
                'k-text': true,
                ...this.themeClasses,
                ...this.textColorClasses,
            };
        },

        styles(): object {
            return {
                ...this.textColorStyles,
            };
        },

        genValue(): string|undefined {
            let value = this.value;

            if (undefined !== value && null !== value) {
                if (this.prepend) {
                    value = this.prepend + ' ' + value;
                }

                if (this.append) {
                    value += ' ' + this.append;
                }
            }

            return value;
        },
    },
});
</script>
