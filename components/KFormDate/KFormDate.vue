<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-form-datetime
        ref="text"
        v-bind="$attrs"
        v-on="$listeners"
        type="date"
    >
        <template v-for="slotItem in getSlotItems('')" v-slot:[slotItem.target]="props">
            <slot :name="slotItem.original" v-bind="props"/>
        </template>
    </k-form-datetime>
</template>

<script lang="ts">
import {formable} from '@klipper/bow/composables/mixins/formable';
import {SlotWrapper} from '@klipper/bow/composables/mixins/slotWrapper';
import {definedComponent} from '@vue/composition-api';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default definedComponent({
    name: 'KFormDate',

    mixins: [
        SlotWrapper,
        formable('text'),
    ],
});
</script>
