<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div
        v-bind="$attrs"
        v-on="$listeners"
        class="k-address-label"
    >
        <div class="k-address-label--label">
            <k-text :value="$oc(value).label()" />

            <v-chip
                v-if="!!$oc(value).reference()"
                class="ml-2"
                x-small
            >
                {{ $oc(value).reference() }}
            </v-chip>

            <k-choice-chip
                :choice="$oc(value).type()"
                :class="{'ml-2': true, 'mt-n1': false}"
                x-small
            />
        </div>

        <div class="k-address-label--address text--secondary text-body-2">
            <k-address
                :value="value"
                :hide-street="hideStreet"
                :hide-street-complement="hideStreetComplement"
                :hide-postal-code="hidePostalCode"
                :hide-city="hideCity"
                :hide-state="hideState"
                :hide-country="hideCountry"
                inline
            />
        </div>
    </div>
</template>

<script lang="ts">
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {defineComponent} from '@vue/composition-api';
import {PropType} from 'vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */

export default defineComponent({
    name: 'KAddressLabel',

    props: {
        value: {
            type: [Object, null] as PropType<Dictionary<any>|null>,
            default: null,
            required: true,
        },

        hideStreet: {
            type: Boolean,
            default: false,
        },

        hideStreetComplement: {
            type: Boolean,
            default: false,
        },

        hidePostalCode: {
            type: Boolean,
            default: false,
        },

        hideCity: {
            type: Boolean,
            default: false,
        },

        hideState: {
            type: Boolean,
            default: false,
        },

        hideCountry: {
            type: Boolean,
            default: false,
        },
    },
});
</script>
