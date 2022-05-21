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
            <k-text :value="self.$oc(value).label()" />

            <v-chip
                v-if="!!self.$oc(value).reference()"
                class="ml-2"
                x-small
            >
                {{ $oc(value).reference() }}
            </v-chip>

            <k-choice-chip
                :choice="self.$oc(value).type()"
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
import {Selfable} from '@klipper/bow/mixins/Selfable';
import {Component, Prop} from 'vue-property-decorator';
import {mixins} from 'vue-class-component';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KAddressLabel extends mixins(
    Selfable,
) {
    @Prop({required: true, default: null})
    public value!: Dictionary<any>|null;

    @Prop({type: Boolean, default: false})
    public hideStreet!: boolean;

    @Prop({type: Boolean, default: true})
    public hideStreetComplement!: boolean;

    @Prop({type: Boolean, default: false})
    public hidePostalCode!: boolean;

    @Prop({type: Boolean, default: false})
    public hideCity!: boolean;

    @Prop({type: Boolean, default: true})
    public hideState!: boolean;

    @Prop({type: Boolean, default: false})
    public hideCountry!: boolean;
}
</script>
