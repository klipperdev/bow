<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-row
        v-bind="$attrs"
        v-on="$listeners"
        class="k-standard-header mt-0 mb-2"
    >
        <v-col class="k-standard-header--title py-0 d-flex align-center flex-grow-1">
            <slot name="header"/>
            <slot name="default"/>
        </v-col>

        <v-col
            v-if="$scopedSlots.actions"
            class="k-standard-header--actions py-0 d-flex align-center flex-grow-0 flex-shrink-1 text-right"
        >
            <slot name="actions"/>
        </v-col>
    </v-row>
</template>

<style lang="scss" src="./KStandardHeader.scss" />

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KStandardHeader extends Vue {
}
</script>
