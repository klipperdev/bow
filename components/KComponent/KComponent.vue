<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-loader-wrapper
        v-bind="$attrs"
        v-on="$listeners"
        :loading="fetchLoading"
        @keydown="onKeyDown"
    >
        <slot
            name="form"
            v-bind="genSlotProps"
        >
            <v-form
                ref="form"
                :disabled="isFormDisabled"
                :readonly="formReadOnly"
                @submit.prevent=""
                autocomplete="off"
            >
                <slot
                    name="default"
                    v-bind="genSlotProps"
                />
            </v-form>
        </slot>
    </k-loader-wrapper>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api';
import {StandardMainComponent} from '@klipper/bow/composables/mixins/standardMainComponent';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default defineComponent({
    name: 'KComponent',

    mixins: [
        StandardMainComponent,
    ],

    props: {
        main: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        /**
         * Override default method.
         */
        isMain(): boolean {
            return this.main;
        },
    },
});
</script>
