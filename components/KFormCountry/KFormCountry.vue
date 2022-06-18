<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-select-country
        ref="selectCountry"
        v-bind="genProps"
        v-on="$listeners"
    >
        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
            <slot :name="slotItem.original" v-bind="props"/>
        </template>
    </k-select-country>
</template>

<script lang="ts">
import {selectFormable} from '@klipper/bow/composables/mixins/formable';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {mixins} from 'vue-class-component';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KFormCountry extends mixins(
    SlotWrapper,
    selectFormable('selectCountry'),
) {
    protected get genProps(): Dictionary<any> {
        const prependInnerIcon = this.$attrs['prepend-inner-icon'];

        return Object.assign({
            'prepend-inner-icon': undefined !== prependInnerIcon ? prependInnerIcon : 'fa-fw fa-globe',
        }, this.$attrs);
    }
}
</script>
