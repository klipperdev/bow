<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-skeleton-loader
        v-bind="$attrs"
        v-on="$listeners"
        :type="type"
        :width="genWidth"
    />
</template>

<script lang="ts">
import {randomNumberBetween} from '@klipper/bow/utils/number';
import {defineComponent} from '@vue/composition-api';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default defineComponent({
    name: 'KSkeletonLoader',

    props: {
        type: {
            type: String,
            default: 'text',
        },

        /**
         * Content width average used to create the skeleton loader
         */
        width: {
            type: String,
            default: 'random',
        },
    },

    computed: {
        genWidth(): string {
            let width = this.width || undefined;

            if ('random' === width) {
                width = randomNumberBetween(30, 80) + '%';
            }

            return width;
        },
    },
});
</script>
